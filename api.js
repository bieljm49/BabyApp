const BabyStore = (() => {

    const K = 'baby_diary_records_v1';
    const C = 'baby_diary_config_v1';

    let records = JSON.parse(
        localStorage.getItem(K) || '[]'
    );

    let config = JSON.parse(
        localStorage.getItem(C) ||
        '{"babyName":"Meu Bebê","caregiver":"Família","apiUrl":""}'
    );

    const persist = () => {
        localStorage.setItem(K, JSON.stringify(records));
    };

    const saveConfig = c => {
        config = { ...config, ...c };
        localStorage.setItem(C, JSON.stringify(config));
        return config;
    };

    const uuid = () =>
        crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now() + '-' + Math.random().toString(16).slice(2);

    // ==============================
    // ADICIONAR REGISTRO
    // ==============================
    async function add(data) {

        const row = {
            id: uuid(),
            createdAt: new Date().toISOString(),
            caregiver: config.caregiver,
            synced: false,
            ...data
        };

        records.unshift(row);
        persist();

        if (config.apiUrl) {
            await sync();
        }

        return row;
    }

    // ==============================
    // REMOVER REGISTRO
    // ==============================
    async function remove(id) {

        records = records.filter(r => r.id !== id);

        persist();

        if (config.apiUrl) {
            try {
                await post({
                    action: 'delete',
                    id
                });
            } catch (e) {
                console.error(
                    'Erro ao excluir registro no Google Sheets:',
                    e
                );
            }
        }
    }

    // ==============================
    // POST PARA GOOGLE APPS SCRIPT
    // ==============================
    // Mesmo método utilizado no seu
    // projeto anterior para evitar CORS.
    // ==============================
    async function post(payload) {

        await fetch(config.apiUrl, {
            method: 'POST',

            // IMPORTANTE:
            // evita o bloqueio de CORS do navegador
            mode: 'no-cors',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(payload)
        });

        // Com no-cors não conseguimos ler
        // normalmente a resposta do POST.
        // A confirmação será feita pelo GET
        // executado posteriormente no sync().
        return { ok: true };
    }

    // ==============================
    // SINCRONIZAÇÃO
    // ==============================
    async function sync() {

        if (!config.apiUrl) {
            return { local: true };
        }

        // Localiza registros ainda não enviados.
        const pending = records.filter(
            r => !r.synced
        );

        // Envia um por um.
        for (const r of pending) {

            await post({
                action: 'save',
                record: r
            });

            r.synced = true;
        }

        persist();

        // ===========================
        // CONSULTAR GOOGLE SHEETS
        // ===========================
        // Aqui NÃO usamos no-cors,
        // porque precisamos ler o JSON.
        // ===========================

        const res = await fetch(
            config.apiUrl + '?action=list'
        );

        if (!res.ok) {
            throw new Error(
                'Falha ao consultar registros no Google Sheets'
            );
        }

        const remote = await res.json();

        // ===========================
        // JUNTA LOCAL + GOOGLE SHEETS
        // ===========================

        if (Array.isArray(remote)) {

            const map = new Map(
                [...remote, ...records].map(
                    r => [r.id, r]
                )
            );

            records = [...map.values()].sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );

            persist();
        }

        return {
            count: pending.length
        };
    }

    // ==============================
    // SUBSTITUIR BASE LOCAL
    // ==============================

    function replace(all) {
        records = all;
        persist();
    }

    // ==============================
    // FUNÇÕES PÚBLICAS
    // ==============================

    return {

        getAll: () => [...records],

        add,

        remove,

        sync,

        getConfig: () => ({
            ...config
        }),

        saveConfig,

        replace
    };

})();


// ==================================
// FORMATAÇÃO DE DATA
// ==================================

const fmtDate = s =>
    new Intl.DateTimeFormat(
        'pt-BR',
        {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }
    ).format(new Date(s));


// ==================================
// MENSAGENS DO APLICATIVO
// ==================================

const toast = m => {

    const e =
        document.getElementById('toast');

    if (!e) return;

    e.textContent = m;

    e.classList.remove('hidden');

    setTimeout(
        () => e.classList.add('hidden'),
        2500
    );
};


// ==================================
// SERVICE WORKER
// ==================================

if ('serviceWorker' in navigator) {

    navigator.serviceWorker
        .register('service-worker.js')
        .catch(() => {});

}