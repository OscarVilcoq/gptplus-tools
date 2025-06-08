document.getElementById('promptForm').addEventListener('submit', async e => {
    e.preventDefault();

    const form      = e.currentTarget;
    const fields    = ['role', 'context', 'task', 'constraints', 'musthave', 'style', 'format', 'audience', 'other'];
    const values    = fields.map(name => form[name].value.trim());

    if (values.every(v => !v)) {
        alert("Merci de remplir au moins un champ.");
        return;
    }

    const [role, context, task, constraints, musthave, style, format, audience, other] = values;

    const prompt = `
        Tu es un ingénieur expert de prompts pour IA.  
        Ta tâche est de créer un prompt détaillé, complet, clair, précis et bien formulé (ne veut pas dire court forcément) à partir des informations fournies.  

        Voici les éléments que tu peux recevoir :  
        - Rôle : la fonction, l’identité ou la personnalité à adopter  
        - Contexte : l’environnement, la situation ou le cadre général  
        - Objectif / Tâche : ce que l’agent doit accomplir ou produire  
        - Contraintes : ce qu’il faut éviter, ignorer, ou limiter  
        - Exigences : les éléments indispensables à inclure  
        - Style / Ton : la manière ou l’ambiance de la réponse (ex. formel, humoristique, concis)  
        - Format : la forme de la sortie (ex. liste, paragraphe, code, résumé)  
        - Audience : à qui s’adresse la réponse (ex. expert, débutant, enfant)  
        - Autres informations spécifiques : toute donnée supplémentaire utile

        ---

        Quand tu reçois ces éléments, fais ceci :  
        1. Ignore les champs vides ou non pertinents.  
        2. Reformule chaque élément en une phrase claire et fluide, en améliorant le style et la grammaire.  
        3. Assemble les phrases en un texte cohérent, en évitant les répétitions.  
        4. Ajoute une introduction ou un lien logique entre les phrases si besoin.  
        5. Termine par une consigne claire pour l’IA destinataire du prompt.

        ---

        Exemple :

        Entrée :  
        - Rôle : assistant créatif  
        - Contexte : aide à écrire une histoire de science-fiction  
        - Tâche : proposer des idées originales de personnages et de scénarios  
        - Contraintes : éviter les clichés classiques  
        - Style : inspirant et engageant  
        - Audience : écrivain amateur

        Sortie :  
        Tu es un assistant créatif dont la mission est d’aider un écrivain amateur à concevoir une histoire de science-fiction. Ton objectif est de proposer des idées originales de personnages et de scénarios, tout en évitant les clichés classiques. Adopte un style inspirant et engageant. Fournis des suggestions claires et variées pour stimuler la créativité.

        ---

        À présent, génère un prompt complet à partir des éléments suivants :
        ${[ 
            role        && `Rôle : ${role}`,
            context     && `Contexte : ${context}`,
            task        && `Objectif / Tâche : ${task}`,
            constraints && `Contraintes : ${constraints}`,
            musthave    && `Exigences / Doit avoir : ${musthave}`,
            style       && `Style / Ton : ${style}`,
            format      && `Format : ${format}`,
            audience    && `Audience : ${audience}`,
            other       && `Autres informations : ${other}`
        ].filter(Boolean).join('\n')}

        Répond uniquement par le prompt généré, sans explications.
    `;

    const tabs  = await chrome.tabs.query({ url: "https://chatgpt.com/*" });
    const tab   = tabs.length ? tabs[0] : await chrome.tabs.create({ url: "https://chatgpt.com/" });
    if (!tabs.length) await new Promise(r => setTimeout(r, 3000));

    await chrome.tabs.update(tab.id, { active: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async (promptText) => {
            const waitForElement = (selector, timeout = 5000) => new Promise((res, rej) => {
                const interval  = 100, maxTime = timeout;
                let elapsed     = 0;
                const timer = setInterval(() => {
                    const el = document.querySelector(selector);
                    if (el) {
                        clearInterval(timer);
                        res(el);
                    } else if ((elapsed += interval) >= maxTime) {
                        clearInterval(timer);
                        rej();
                    }
                }, interval);
            });

            try {
                const textarea  = await waitForElement('#prompt-textarea');
                const p         = document.createElement('p');
                textarea.innerHTML = '';
                p.textContent = promptText;

                textarea.appendChild(p);

                const btn = await waitForElement('#composer-submit-button');
                btn.click();
            } catch {
                alert('Zone de texte non trouvée');
            }
        },
        args: [prompt]
    });
});