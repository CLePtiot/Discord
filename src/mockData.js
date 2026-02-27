// mockData.js
export const SERVERS = [
    { id: 'home', name: 'Messages Directs', icon: 'A', isHome: true },
    { id: 's1', name: 'Project Freedom Dev', icon: 'P' },
    { id: 's2', name: 'Gaming Lounge', icon: 'G' },
    { id: 's3', name: 'Crypto Alpha', icon: 'C' },
    { id: 's4', name: 'Design Hub', icon: 'D' },
    { id: 's5', name: 'Music Producers', icon: 'M' }
];

export const CHANNELS_BY_SERVER = {
    'home': [],
    's1': [
        { category: 'Information', channels: [{ id: 'c1', name: 'annonces', type: 'announcement' }, { id: 'c2', name: 'règlement', type: 'text' }] },
        { category: 'Général', channels: [{ id: 'c3', name: 'général', type: 'text' }, { id: 'c4', name: 'idées', type: 'forum' }] },
        { category: 'Vocal', channels: [{ id: 'cv1', name: 'Discussion', type: 'voice' }, { id: 'cv2', name: 'Réunion', type: 'voice' }] },
    ],
    's2': [
        { category: 'Text Channels', channels: [{ id: 'c5', name: 'general', type: 'text' }, { id: 'c6', name: 'lfg', type: 'text' }] },
        { category: 'Voice Channels', channels: [{ id: 'cv3', name: 'Lobby', type: 'voice' }] },
    ],
    's3': [
        { category: 'Markets', channels: [{ id: 'c7', name: 'bitcoin', type: 'text' }, { id: 'c8', name: 'altcoins', type: 'text' }] },
    ],
    's4': [
        { category: 'UI/UX', channels: [{ id: 'c9', name: 'inspirations', type: 'text' }] },
    ],
    's5': [
        { category: 'Collab', channels: [{ id: 'c10', name: 'beats', type: 'text' }] }
    ]
};

export const MOCK_CHANNEL_NAMES = {
    'c1': 'annonces', 'c2': 'règlement', 'c3': 'général', 'c4': 'idées', 'c5': 'general', 'c6': 'lfg', 'c7': 'bitcoin', 'c8': 'altcoins',
    'c9': 'inspirations', 'c10': 'beats',
    'cv1': 'Discussion', 'cv2': 'Réunion', 'cv3': 'Lobby'
};

export const MOCK_MESSAGES = [
    { id: 'm1', author: 'Alice', avatar: 'https://i.pravatar.cc/150?img=33', content: "Salut tout le monde ! Le projet a l'air génial. Hâte de voir la suite.", timestamp: "Aujourd'hui à 14:32", role: 'member' },
    { id: 'm2', author: 'Satoshi (Moi)', avatar: 'https://i.pravatar.cc/150?img=11', content: "Merci Alice ! On commence tout juste le MVP. Le focus est sur l'architecture UI pour l'instant.", timestamp: "Aujourd'hui à 14:35", role: 'admin' },
    { id: 'm3', author: 'Bob', avatar: 'https://i.pravatar.cc/150?img=12', content: "N'oubliez pas que l'anonymat est la priorité absolue du projet.", timestamp: "Aujourd'hui à 14:40", role: 'moderator' },
    { id: 'm4', author: 'Alice', avatar: 'https://i.pravatar.cc/150?img=33', content: "Oui, le système de routage devra être nickel.", timestamp: "Aujourd'hui à 14:42", role: 'member' },
    { id: 'm5', author: 'Charlie', avatar: 'https://i.pravatar.cc/150?img=5', content: "Quelqu'un a jeté un oeil à Matrix comme backend ?", timestamp: "Aujourd'hui à 14:45", role: 'member' },
    { id: 'm6', author: 'Satoshi (Moi)', avatar: 'https://i.pravatar.cc/150?img=11', content: "Matrix est cool, mais on risque de perdre en flexibilité si on veut customiser le système de clés.", timestamp: "Aujourd'hui à 14:46", role: 'admin' },
    { id: 'm7', author: 'Dave', avatar: 'https://i.pravatar.cc/150?img=15', content: "Je m'occupe des implémentations WebRTC si vous voulez.", timestamp: "Aujourd'hui à 14:50", role: 'member' },
    { id: 'm8', author: 'Bob', avatar: 'https://i.pravatar.cc/150?img=12', content: "Super Dave, on en reparle à la réu de 16h.", timestamp: "Aujourd'hui à 14:55", role: 'moderator' },
    { id: 'm9', author: 'Eve', avatar: 'https://i.pravatar.cc/150?img=20', content: "J'ai créé des mockups pour la vue DMs.", timestamp: "Aujourd'hui à 15:10", role: 'member' },
    { id: 'm10', author: 'Satoshi (Moi)', avatar: 'https://i.pravatar.cc/150?img=11', content: "Envoie ça sur #idées Eve, on va regarder.", timestamp: "Aujourd'hui à 15:12", role: 'admin' }
];

export const MOCK_MEMBERS = [
    { id: 'mem2', name: 'Satoshi (Moi)', avatar: 'https://i.pravatar.cc/150?img=11', status: 'online', group: 'Admin' },
    { id: 'mem1', name: 'Bob', avatar: 'https://i.pravatar.cc/150?img=12', status: 'online', group: 'Modérateur' },
    { id: 'mem3', name: 'Alice', avatar: 'https://i.pravatar.cc/150?img=33', status: 'online', group: 'En ligne' },
    { id: 'mem4', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?img=5', status: 'offline', group: 'Hors ligne' },
    { id: 'mem5', name: 'Dave', avatar: 'https://i.pravatar.cc/150?img=15', status: 'offline', group: 'Hors ligne' },
    { id: 'mem6', name: 'Eve', avatar: 'https://i.pravatar.cc/150?img=20', status: 'offline', group: 'Hors ligne' }
];
