import { Category, Service, Trigger, ExpertLibraryItem } from './types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Pacotes Jericoacoara',
    emoji: '🏖️',
    color: '#3B82F6',
    description: 'Pacotes completos para Jericoacoara com hospedagem e passeios'
  },
  {
    id: '2',
    name: 'Pacotes Fortaleza',
    emoji: '🏙️',
    color: '#10B981',
    description: 'Experiências urbanas em Fortaleza com city tours e cultura'
  },
  {
    id: '3',
    name: 'Serviços Regulares',
    emoji: '🚌',
    color: '#F59E0B',
    description: 'Transfers e transportes regulares com horários fixos'
  },
  {
    id: '4',
    name: 'Passeios Privativos',
    emoji: '🚗',
    color: '#EF4444',
    description: 'Passeios exclusivos com veículos privativos'
  }
];

export const triggers: Trigger[] = [
  {
    id: '1',
    icon: 'Zap',
    name: 'Urgência Limitada',
    description: 'Cria senso de urgência com vagas limitadas',
    color: '#EF4444',
    link: 'https://portal.servicos.sim7viagens.com/trigger/urgencia'
  },
  {
    id: '2',
    icon: 'Gift',
    name: 'Oferta Especial',
    description: 'Destaca promoções e descontos especiais',
    color: '#10B981',
    link: 'https://portal.servicos.sim7viagens.com/trigger/oferta'
  },
  {
    id: '3',
    icon: 'Star',
    name: 'Mais Vendido',
    description: 'Indica os serviços mais populares',
    color: '#F59E0B',
    link: 'https://portal.servicos.sim7viagens.com/trigger/popular'
  }
];

export const services: Service[] = [
  {
    id: '1',
    categoryId: '1',
    name: 'Jericoacoara Completo 3 Dias',
    shortDescription: 'Pacote completo com hospedagem, transfers e passeios',
    description: 'Experimente o melhor de Jericoacoara em 3 dias inesquecíveis. Inclui hospedagem, todos os transfers e os principais passeios da região.',
    about: 'Jericoacoara é um dos destinos mais procurados do Ceará, conhecido por suas dunas, lagoas cristalinas e pôr do sol único.',
    duration: '3 dias / 2 noites',
    included: [
      'Hospedagem em pousada categoria turística',
      'Transfer Fortaleza - Jericoacoara - Fortaleza',
      'Passeio de buggy pelas dunas',
      'Visita à Lagoa Azul e Lagoa do Paraíso',
      'Café da manhã todos os dias'
    ],
    notIncluded: [
      'Almoços e jantares',
      'Bebidas alcoólicas',
      'Passeios opcionais',
      'Seguro viagem'
    ],
    highlights: [
      'Pôr do sol na Duna do Pôr do Sol',
      'Banho nas lagoas cristalinas',
      'Passeio de buggy emocionante',
      'Vila de Jericoacoara autêntica'
    ],
    importantNotes: [
      'Levar protetor solar e chapéu',
      'Usar roupas leves e confortáveis',
      'Documentos obrigatórios: RG ou CNH'
    ],
    rules: [
      'Check-in: 14h | Check-out: 12h',
      'Não é permitido fumar nas acomodações',
      'Animais não são permitidos'
    ],
    expertLibrary: [
      {
        id: '1',
        name: 'Guia Completo Jericoacoara',
        icon: 'FileText',
        link: 'https://sim7viagens.com/guia-jericoacoara.pdf'
      },
      {
        id: '2',
        name: 'Mapa das Lagoas',
        icon: 'Map',
        link: 'https://sim7viagens.com/mapa-lagoas.pdf'
      }
    ],
    pricing: {
      type: 'por-pacote',
      accommodationCategories: [
        {
          name: 'Padrão',
          lowSeason: {
            single: 1360,
            fromTwo: 850
          },
          highSeason: {
            single: 1680,
            fromTwo: 1050
          }
        },
        {
          name: 'Superior',
          lowSeason: {
            single: 1560,
            fromTwo: 950
          },
          highSeason: {
            single: 1880,
            fromTwo: 1150
          }
        },
        {
          name: 'Luxo',
          lowSeason: {
            single: 1960,
            fromTwo: 1250
          },
          highSeason: {
            single: 2280,
            fromTwo: 1450
          }
        }
      ]
    }
  },
  {
    id: '2',
    categoryId: '3',
    name: 'Transfer Aeroporto - Hotel',
    shortDescription: 'Transfer regular do aeroporto para hotéis em Fortaleza',
    description: 'Serviço de transfer confortável e seguro do Aeroporto de Fortaleza para hotéis na cidade.',
    about: 'Transfer executivo com veículos climatizados e motoristas experientes.',
    duration: '45 minutos (aproximadamente)',
    included: [
      'Transporte do aeroporto ao hotel',
      'Motorista experiente',
      'Veículo climatizado',
      'Acompanhamento do voo'
    ],
    notIncluded: [
      'Gorjetas',
      'Paradas extras',
      'Bagagem excessiva'
    ],
    highlights: [
      'Pontualidade garantida',
      'Veículos novos e limpos',
      'Motoristas uniformizados',
      'Atendimento 24h'
    ],
    importantNotes: [
      'Informar número do voo',
      'Aguardar no desembarque',
      'Contato disponível 24h'
    ],
    rules: [
      'Tolerância de 15 minutos',
      'Máximo 2 bagagens por pessoa',
      'Cancelamento até 2h antes'
    ],
    expertLibrary: [
      {
        id: '3',
        name: 'Pontos de Encontro',
        icon: 'MapPin',
        link: 'https://sim7viagens.com/pontos-encontro.pdf'
      }
    ],
    pricing: {
      type: 'por-pessoa',
      pricePerPerson: 35
    }
  },
  {
    id: '3',
    categoryId: '4',
    name: 'City Tour Fortaleza Privativo',
    shortDescription: 'Passeio privativo pelos principais pontos turísticos de Fortaleza',
    description: 'Conheça Fortaleza com exclusividade em um passeio privativo pelos principais pontos turísticos da cidade.',
    about: 'Tour personalizado com guia especializado e veículo exclusivo para seu grupo.',
    duration: '6 horas',
    included: [
      'Veículo privativo climatizado',
      'Guia especializado',
      'Combustível',
      'Estacionamentos'
    ],
    notIncluded: [
      'Almoço',
      'Ingressos para atrações',
      'Bebidas',
      'Compras pessoais'
    ],
    highlights: [
      'Centro Dragão do Mar',
      'Mercado Central',
      'Praia de Iracema',
      'Catedral Metropolitana'
    ],
    importantNotes: [
      'Usar roupas confortáveis',
      'Levar câmera fotográfica',
      'Protetor solar obrigatório'
    ],
    rules: [
      'Horário flexível de início',
      'Máximo 8 pessoas por veículo',
      'Roteiro pode ser personalizado'
    ],
    expertLibrary: [
      {
        id: '4',
        name: 'Roteiro Detalhado',
        icon: 'Route',
        link: 'https://sim7viagens.com/roteiro-fortaleza.pdf'
      },
      {
        id: '5',
        name: 'História de Fortaleza',
        icon: 'Book',
        link: 'https://sim7viagens.com/historia-fortaleza.pdf'
      }
    ],
    pricing: {
      type: 'por-carro',
      vehicleCapacities: [
        { capacity: 4, price: 280 },
        { capacity: 6, price: 350 },
        { capacity: 8, price: 420 }
      ]
    }
  }
];