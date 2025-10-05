'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Package, 
  Zap,
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  Eye,
  BarChart3,
  Users,
  TrendingUp,
  Link as LinkIcon,
  FileText,
  Map,
  MapPin,
  Route,
  Book,
  Star,
  Gift,
  DollarSign,
  Car,
  User,
  Calendar
} from 'lucide-react';
import { categories, services, triggers } from '@/lib/data';
import { Category, Service, Trigger, ExpertLibraryItem, PricingType } from '@/lib/types';

type ActiveSection = 'dashboard' | 'categories' | 'services' | 'triggers';
type ServiceFormStep = 'basic' | 'details' | 'pricing';

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [serviceFormStep, setServiceFormStep] = useState<ServiceFormStep>('basic');
  const [selectedPricingType, setSelectedPricingType] = useState<PricingType['type']>('por-pessoa');

  // Estados para formulários
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    emoji: '',
    color: '#1e40af',
    description: ''
  });

  const [newService, setNewService] = useState<Partial<Service>>({
    categoryId: '',
    name: '',
    shortDescription: '',
    description: '',
    about: '',
    duration: '',
    included: [],
    notIncluded: [],
    highlights: [],
    importantNotes: [],
    rules: [],
    expertLibrary: [],
    pricing: { type: 'por-pessoa', pricePerPerson: 0 }
  });

  const [newTrigger, setNewTrigger] = useState<Partial<Trigger>>({
    icon: 'Zap',
    name: '',
    description: '',
    color: '#ef4444',
    link: ''
  });

  const [newExpertItem, setNewExpertItem] = useState<Partial<ExpertLibraryItem>>({
    name: '',
    icon: 'FileText',
    link: ''
  });

  // Funções auxiliares
  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Zap, Gift, Star, FileText, Map, MapPin, Route, Book, LinkIcon, DollarSign, Car, User, Calendar
    };
    return icons[iconName] || FileText;
  };

  const addListItem = (field: keyof Service, value: string) => {
    if (!value.trim()) return;
    const currentList = (newService[field] as string[]) || [];
    setNewService({
      ...newService,
      [field]: [...currentList, value.trim()]
    });
  };

  const removeListItem = (field: keyof Service, index: number) => {
    const currentList = (newService[field] as string[]) || [];
    setNewService({
      ...newService,
      [field]: currentList.filter((_, i) => i !== index)
    });
  };

  const addExpertLibraryItem = () => {
    if (!newExpertItem.name || !newExpertItem.link) return;
    const currentLibrary = newService.expertLibrary || [];
    setNewService({
      ...newService,
      expertLibrary: [...currentLibrary, {
        id: Date.now().toString(),
        name: newExpertItem.name!,
        icon: newExpertItem.icon!,
        link: newExpertItem.link!
      }]
    });
    setNewExpertItem({ name: '', icon: 'FileText', link: '' });
  };

  const removeExpertLibraryItem = (index: number) => {
    const currentLibrary = newService.expertLibrary || [];
    setNewService({
      ...newService,
      expertLibrary: currentLibrary.filter((_, i) => i !== index)
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Aqui você pode adicionar uma notificação de sucesso
  };

  const resetForms = () => {
    setNewCategory({ name: '', emoji: '', color: '#1e40af', description: '' });
    setNewService({
      categoryId: '',
      name: '',
      shortDescription: '',
      description: '',
      about: '',
      duration: '',
      included: [],
      notIncluded: [],
      highlights: [],
      importantNotes: [],
      rules: [],
      expertLibrary: [],
      pricing: { type: 'por-pessoa', pricePerPerson: 0 }
    });
    setNewTrigger({ icon: 'Zap', name: '', description: '', color: '#ef4444', link: '' });
    setNewExpertItem({ name: '', icon: 'FileText', link: '' });
    setIsCreating(false);
    setEditingItem(null);
    setServiceFormStep('basic');
  };

  // Componente de Pricing
  const PricingForm = () => {
    const updatePricing = (pricing: PricingType) => {
      setNewService({ ...newService, pricing });
    };

    switch (selectedPricingType) {
      case 'por-pessoa':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-navy-800">Precificação por Pessoa</h4>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Valor por Pessoa (R$)
              </label>
              <input
                type="number"
                value={(newService.pricing as any)?.pricePerPerson || 0}
                onChange={(e) => updatePricing({
                  type: 'por-pessoa',
                  pricePerPerson: Number(e.target.value)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>
        );

      case 'por-carro':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-navy-800">Precificação por Veículo</h4>
            <div className="space-y-3">
              {((newService.pricing as any)?.vehicleCapacities || []).map((vehicle: any, index: number) => (
                <div key={index} className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg">
                  <input
                    type="number"
                    value={vehicle.capacity}
                    onChange={(e) => {
                      const capacities = [...((newService.pricing as any)?.vehicleCapacities || [])];
                      capacities[index] = { ...capacities[index], capacity: Number(e.target.value) };
                      updatePricing({ type: 'por-carro', vehicleCapacities: capacities });
                    }}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="4"
                  />
                  <span className="text-sm text-gray-600">pessoas</span>
                  <input
                    type="number"
                    value={vehicle.price}
                    onChange={(e) => {
                      const capacities = [...((newService.pricing as any)?.vehicleCapacities || [])];
                      capacities[index] = { ...capacities[index], price: Number(e.target.value) };
                      updatePricing({ type: 'por-carro', vehicleCapacities: capacities });
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="280.00"
                  />
                  <button
                    onClick={() => {
                      const capacities = ((newService.pricing as any)?.vehicleCapacities || []).filter((_: any, i: number) => i !== index);
                      updatePricing({ type: 'por-carro', vehicleCapacities: capacities });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const capacities = [...((newService.pricing as any)?.vehicleCapacities || []), { capacity: 4, price: 0 }];
                  updatePricing({ type: 'por-carro', vehicleCapacities: capacities });
                }}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-navy-400 hover:text-navy-600"
              >
                + Adicionar Capacidade
              </button>
            </div>
          </div>
        );

      case 'valor-unico':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-navy-800">Valor Único</h4>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Valor Fixo (R$)
              </label>
              <input
                type="number"
                value={(newService.pricing as any)?.fixedPrice || 0}
                onChange={(e) => updatePricing({
                  type: 'valor-unico',
                  fixedPrice: Number(e.target.value)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>
        );

      case 'por-pacote':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-navy-800">Precificação por Pacote</h4>
            <div className="space-y-4">
              {((newService.pricing as any)?.accommodationCategories || []).map((category: any, index: number) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => {
                        const categories = [...((newService.pricing as any)?.accommodationCategories || [])];
                        categories[index] = { ...categories[index], name: e.target.value };
                        updatePricing({ type: 'por-pacote', accommodationCategories: categories });
                      }}
                      className="font-medium text-navy-800 bg-transparent border-none focus:outline-none"
                      placeholder="Nome da categoria"
                    />
                    <button
                      onClick={() => {
                        const categories = ((newService.pricing as any)?.accommodationCategories || []).filter((_: any, i: number) => i !== index);
                        updatePricing({ type: 'por-pacote', accommodationCategories: categories });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Baixa Temporada</h5>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-600">Single (1 pessoa)</label>
                          <input
                            type="number"
                            value={category.lowSeason?.single || 0}
                            onChange={(e) => {
                              const categories = [...((newService.pricing as any)?.accommodationCategories || [])];
                              categories[index] = {
                                ...categories[index],
                                lowSeason: { ...categories[index].lowSeason, single: Number(e.target.value) }
                              };
                              updatePricing({ type: 'por-pacote', accommodationCategories: categories });
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="1360"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">A partir de 2 pessoas</label>
                          <input
                            type="number"
                            value={category.lowSeason?.fromTwo || 0}
                            onChange={(e) => {
                              const categories = [...((newService.pricing as any)?.accommodationCategories || [])];
                              categories[index] = {
                                ...categories[index],
                                lowSeason: { ...categories[index].lowSeason, fromTwo: Number(e.target.value) }
                              };
                              updatePricing({ type: 'por-pacote', accommodationCategories: categories });
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="850"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Alta Temporada</h5>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-600">Single (1 pessoa)</label>
                          <input
                            type="number"
                            value={category.highSeason?.single || 0}
                            onChange={(e) => {
                              const categories = [...((newService.pricing as any)?.accommodationCategories || [])];
                              categories[index] = {
                                ...categories[index],
                                highSeason: { ...categories[index].highSeason, single: Number(e.target.value) }
                              };
                              updatePricing({ type: 'por-pacote', accommodationCategories: categories });
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="1680"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">A partir de 2 pessoas</label>
                          <input
                            type="number"
                            value={category.highSeason?.fromTwo || 0}
                            onChange={(e) => {
                              const categories = [...((newService.pricing as any)?.accommodationCategories || [])];
                              categories[index] = {
                                ...categories[index],
                                highSeason: { ...categories[index].highSeason, fromTwo: Number(e.target.value) }
                              };
                              updatePricing({ type: 'por-pacote', accommodationCategories: categories });
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="1050"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => {
                  const categories = [...((newService.pricing as any)?.accommodationCategories || []), {
                    name: 'Nova Categoria',
                    lowSeason: { single: 0, fromTwo: 0 },
                    highSeason: { single: 0, fromTwo: 0 }
                  }];
                  updatePricing({ type: 'por-pacote', accommodationCategories: categories });
                }}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-navy-400 hover:text-navy-600"
              >
                + Adicionar Categoria de Hospedagem
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/89fafb3f-f749-4690-af44-d76c4d990151.png" 
              alt="SIM7 Viagens" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-2xl font-bold text-navy-900">Painel Administrativo</h1>
              <p className="text-navy-600">Gerencie categorias, serviços e gatilhos</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === 'dashboard' 
                  ? 'bg-navy-100 text-navy-900 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => setActiveSection('categories')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === 'categories' 
                  ? 'bg-navy-100 text-navy-900 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FolderOpen className="w-5 h-5" />
              <span>Categorias</span>
            </button>
            
            <button
              onClick={() => setActiveSection('services')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === 'services' 
                  ? 'bg-navy-100 text-navy-900 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Serviços</span>
            </button>

            <button
              onClick={() => setActiveSection('triggers')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === 'triggers' 
                  ? 'bg-navy-100 text-navy-900 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Zap className="w-5 h-5" />
              <span>Biblioteca de Gatilhos</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Dashboard */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-navy-900 mb-2">Dashboard</h2>
                <p className="text-navy-600">Visão geral do sistema de gerenciamento</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Categorias</p>
                      <p className="text-2xl font-bold text-navy-900">{categories.length}</p>
                    </div>
                    <div className="p-3 bg-navy-100 rounded-lg">
                      <FolderOpen className="w-6 h-6 text-navy-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Serviços</p>
                      <p className="text-2xl font-bold text-navy-900">{services.length}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Gatilhos</p>
                      <p className="text-2xl font-bold text-navy-900">{triggers.length}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Zap className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Links Especialista</p>
                      <p className="text-2xl font-bold text-navy-900">
                        {services.reduce((total, service) => total + service.expertLibrary.length, 0)}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-navy-900 mb-4">Atividade Recente</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Plus className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Novo serviço criado</p>
                      <p className="text-sm text-gray-600">Jericoacoara Completo 3 Dias foi adicionado</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Categoria atualizada</p>
                      <p className="text-sm text-gray-600">Pacotes Jericoacoara foi modificado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Categories Section */}
          {activeSection === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-navy-900 mb-2">Categorias</h2>
                  <p className="text-navy-600">Gerencie as categorias de serviços</p>
                </div>
                <button
                  onClick={() => setIsCreating(true)}
                  className="bg-navy-600 text-white px-4 py-2 rounded-lg hover:bg-navy-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Categoria</span>
                </button>
              </div>

              {/* Create/Edit Category Form */}
              {isCreating && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-navy-900 mb-4">Nova Categoria</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">Nome da Categoria</label>
                      <input
                        type="text"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                        placeholder="Ex: Pacotes Jericoacoara"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">Emoji</label>
                      <input
                        type="text"
                        value={newCategory.emoji}
                        onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                        placeholder="🏖️"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">Cor</label>
                      <input
                        type="color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">Descrição</label>
                      <textarea
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                        rows={3}
                        placeholder="Breve descrição da categoria"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={resetForms}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        // Aqui você salvaria a categoria
                        console.log('Salvando categoria:', newCategory);
                        resetForms();
                      }}
                      className="px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700"
                    >
                      Salvar Categoria
                    </button>
                  </div>
                </div>
              )}

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{category.emoji}</span>
                        <div>
                          <h3 className="font-semibold text-navy-900">{category.name}</h3>
                          <div 
                            className="w-4 h-4 rounded-full mt-1"
                            style={{ backgroundColor: category.color }}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-navy-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                    <div className="text-xs text-gray-500">
                      {services.filter(s => s.categoryId === category.id).length} serviços
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Section */}
          {activeSection === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-navy-900 mb-2">Serviços</h2>
                  <p className="text-navy-600">Gerencie os serviços turísticos</p>
                </div>
                <button
                  onClick={() => setIsCreating(true)}
                  className="bg-navy-600 text-white px-4 py-2 rounded-lg hover:bg-navy-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Serviço</span>
                </button>
              </div>

              {/* Filters - Only show when NOT creating a new service */}
              {!isCreating && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center space-x-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    >
                      <option value="all">Todas as categorias</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.emoji} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Create/Edit Service Form */}
              {isCreating && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-navy-900">Novo Serviço</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setServiceFormStep('basic')}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          serviceFormStep === 'basic' 
                            ? 'bg-navy-100 text-navy-700' 
                            : 'text-gray-500'
                        }`}
                      >
                        Básico
                      </button>
                      <button
                        onClick={() => setServiceFormStep('details')}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          serviceFormStep === 'details' 
                            ? 'bg-navy-100 text-navy-700' 
                            : 'text-gray-500'
                        }`}
                      >
                        Detalhes
                      </button>
                      <button
                        onClick={() => setServiceFormStep('pricing')}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          serviceFormStep === 'pricing' 
                            ? 'bg-navy-100 text-navy-700' 
                            : 'text-gray-500'
                        }`}
                      >
                        Precificação
                      </button>
                    </div>
                  </div>

                  {/* Basic Info Step */}
                  {serviceFormStep === 'basic' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">Categoria</label>
                          <select
                            value={newService.categoryId}
                            onChange={(e) => setNewService({ ...newService, categoryId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                          >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.emoji} {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">Duração</label>
                          <input
                            type="text"
                            value={newService.duration}
                            onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                            placeholder="Ex: 3 dias / 2 noites"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">Nome do Serviço</label>
                        <input
                          type="text"
                          value={newService.name}
                          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                          placeholder="Ex: Jericoacoara Completo 3 Dias"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">Breve Descrição</label>
                        <textarea
                          value={newService.shortDescription}
                          onChange={(e) => setNewService({ ...newService, shortDescription: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                          rows={2}
                          placeholder="Descrição curta para listagens"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">Descrição Completa</label>
                        <textarea
                          value={newService.description}
                          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                          rows={4}
                          placeholder="Descrição detalhada do serviço"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">Sobre o Serviço</label>
                        <textarea
                          value={newService.about}
                          onChange={(e) => setNewService({ ...newService, about: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                          rows={3}
                          placeholder="Informações adicionais sobre o destino/serviço"
                        />
                      </div>
                    </div>
                  )}

                  {/* Details Step */}
                  {serviceFormStep === 'details' && (
                    <div className="space-y-6">
                      {/* Included Items */}
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">O que está incluído</label>
                        <div className="space-y-2">
                          {(newService.included || []).map((item, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                              <span className="flex-1 text-sm">{item}</span>
                              <button
                                onClick={() => removeListItem('included', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Adicionar item incluído"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addListItem('included', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addListItem('included', input.value);
                                input.value = '';
                              }}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Not Included Items */}
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">O que não está incluído</label>
                        <div className="space-y-2">
                          {(newService.notIncluded || []).map((item, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
                              <span className="flex-1 text-sm">{item}</span>
                              <button
                                onClick={() => removeListItem('notIncluded', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Adicionar item não incluído"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addListItem('notIncluded', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addListItem('notIncluded', input.value);
                                input.value = '';
                              }}
                              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">Destaques</label>
                        <div className="space-y-2">
                          {(newService.highlights || []).map((item, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                              <span className="flex-1 text-sm">{item}</span>
                              <button
                                onClick={() => removeListItem('highlights', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Adicionar destaque"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addListItem('highlights', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addListItem('highlights', input.value);
                                input.value = '';
                              }}
                              className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Important Notes */}
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">Observações Importantes</label>
                        <div className="space-y-2">
                          {(newService.importantNotes || []).map((item, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                              <span className="flex-1 text-sm">{item}</span>
                              <button
                                onClick={() => removeListItem('importantNotes', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Adicionar observação importante"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addListItem('importantNotes', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addListItem('importantNotes', input.value);
                                input.value = '';
                              }}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Rules */}
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">Normas</label>
                        <div className="space-y-2">
                          {(newService.rules || []).map((item, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                              <span className="flex-1 text-sm">{item}</span>
                              <button
                                onClick={() => removeListItem('rules', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Adicionar norma"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addListItem('rules', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addListItem('rules', input.value);
                                input.value = '';
                              }}
                              className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expert Library */}
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">Biblioteca do Especialista</label>
                        <div className="space-y-2">
                          {(newService.expertLibrary || []).map((item, index) => {
                            const IconComponent = getIconComponent(item.icon);
                            return (
                              <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                                <IconComponent className="w-5 h-5 text-purple-600" />
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{item.name}</p>
                                  <p className="text-xs text-gray-600">{item.link}</p>
                                </div>
                                <button
                                  onClick={() => removeExpertLibraryItem(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="Nome do link"
                              value={newExpertItem.name}
                              onChange={(e) => setNewExpertItem({ ...newExpertItem, name: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                            />
                            <select
                              value={newExpertItem.icon}
                              onChange={(e) => setNewExpertItem({ ...newExpertItem, icon: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                            >
                              <option value="FileText">📄 Documento</option>
                              <option value="Map">🗺️ Mapa</option>
                              <option value="MapPin">📍 Local</option>
                              <option value="Route">🛣️ Roteiro</option>
                              <option value="Book">📚 Guia</option>
                              <option value="LinkIcon">🔗 Link</option>
                            </select>
                            <div className="flex space-x-2">
                              <input
                                type="url"
                                placeholder="URL do link"
                                value={newExpertItem.link}
                                onChange={(e) => setNewExpertItem({ ...newExpertItem, link: e.target.value })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                              />
                              <button
                                onClick={addExpertLibraryItem}
                                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pricing Step */}
                  {serviceFormStep === 'pricing' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">Tipo de Precificação</label>
                        <select
                          value={selectedPricingType}
                          onChange={(e) => {
                            const type = e.target.value as PricingType['type'];
                            setSelectedPricingType(type);
                            
                            // Reset pricing based on type
                            switch (type) {
                              case 'por-pessoa':
                                setNewService({ ...newService, pricing: { type: 'por-pessoa', pricePerPerson: 0 } });
                                break;
                              case 'por-carro':
                                setNewService({ ...newService, pricing: { type: 'por-carro', vehicleCapacities: [] } });
                                break;
                              case 'valor-unico':
                                setNewService({ ...newService, pricing: { type: 'valor-unico', fixedPrice: 0 } });
                                break;
                              case 'por-pacote':
                                setNewService({ ...newService, pricing: { type: 'por-pacote', accommodationCategories: [] } });
                                break;
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                        >
                          <option value="por-pessoa">Por Pessoa</option>
                          <option value="por-carro">Por Veículo</option>
                          <option value="valor-unico">Valor Único</option>
                          <option value="por-pacote">Por Pacote</option>
                        </select>
                      </div>

                      <PricingForm />
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={resetForms}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        // Aqui você salvaria o serviço
                        console.log('Salvando serviço:', newService);
                        resetForms();
                      }}
                      className="px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700"
                    >
                      Salvar Serviço
                    </button>
                  </div>
                </div>
              )}

              {/* Services Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services
                  .filter(service => selectedCategory === 'all' || service.categoryId === selectedCategory)
                  .filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((service) => {
                    const category = categories.find(c => c.id === service.categoryId);
                    return (
                      <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{category?.emoji}</span>
                            <div>
                              <h3 className="font-semibold text-navy-900">{service.name}</h3>
                              <p className="text-sm text-gray-600">{category?.name}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-gray-400 hover:text-navy-600">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-navy-600">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{service.shortDescription}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">⏱️ {service.duration}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">
                              {service.pricing.type === 'por-pessoa' && `R$ ${(service.pricing as any).pricePerPerson}/pessoa`}
                              {service.pricing.type === 'por-carro' && 'Por veículo'}
                              {service.pricing.type === 'valor-unico' && `R$ ${(service.pricing as any).fixedPrice}`}
                              {service.pricing.type === 'por-pacote' && 'Por pacote'}
                            </span>
                          </div>
                        </div>
                        {service.expertLibrary.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-2">Biblioteca do Especialista:</p>
                            <div className="flex flex-wrap gap-1">
                              {service.expertLibrary.map((item, index) => {
                                const IconComponent = getIconComponent(item.icon);
                                return (
                                  <span key={index} className="inline-flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                    <IconComponent className="w-3 h-3" />
                                    <span>{item.name}</span>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Triggers Section */}
          {activeSection === 'triggers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-navy-900 mb-2">Biblioteca de Gatilhos</h2>
                  <p className="text-navy-600">Gerencie os gatilhos de conversão</p>
                </div>
                <button
                  onClick={() => setIsCreating(true)}
                  className="bg-navy-600 text-white px-4 py-2 rounded-lg hover:bg-navy-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Gatilho</span>
                </button>
              </div>

              {/* Create/Edit Trigger Form */}
              {isCreating && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-navy-900 mb-4">Novo Gatilho</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">Ícone do Gatilho</label>
                      <select
                        value={newTrigger.icon}
                        onChange={(e) => setNewTrigger({ ...newTrigger, icon: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      >
                        <option value="Zap">⚡ Urgência</option>
                        <option value="Gift">🎁 Oferta</option>
                        <option value="Star">⭐ Popular</option>
                        <option value="DollarSign">💰 Desconto</option>
                        <option value="Calendar">📅 Limitado</option>
                        <option value="User">👤 Exclusivo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">Nome do Gatilho</label>
                      <input
                        type="text"
                        value={newTrigger.name}
                        onChange={(e) => setNewTrigger({ ...newTrigger, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                        placeholder="Ex: Urgência Limitada"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">Cor do Gatilho</label>
                      <input
                        type="color"
                        value={newTrigger.color}
                        onChange={(e) => setNewTrigger({ ...newTrigger, color: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">Link do Gatilho</label>
                      <input
                        type="url"
                        value={newTrigger.link}
                        onChange={(e) => setNewTrigger({ ...newTrigger, link: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                        placeholder="https://portal.servicos.sim7viagens.com/trigger/..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-navy-700 mb-2">Breve Descrição</label>
                      <textarea
                        value={newTrigger.description}
                        onChange={(e) => setNewTrigger({ ...newTrigger, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                        rows={3}
                        placeholder="Descreva como este gatilho funciona"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={resetForms}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        // Aqui você salvaria o gatilho
                        console.log('Salvando gatilho:', newTrigger);
                        resetForms();
                      }}
                      className="px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700"
                    >
                      Salvar Gatilho
                    </button>
                  </div>
                </div>
              )}

              {/* Triggers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {triggers.map((trigger) => {
                  const IconComponent = getIconComponent(trigger.icon);
                  return (
                    <div key={trigger.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div 
                        className="h-2"
                        style={{ backgroundColor: trigger.color }}
                      />
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${trigger.color}20` }}
                            >
                              <IconComponent 
                                className="w-5 h-5" 
                                style={{ color: trigger.color }}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-navy-900">{trigger.name}</h3>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => copyToClipboard(trigger.link)}
                              className="text-gray-400 hover:text-navy-600"
                              title="Copiar link"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-navy-600">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{trigger.description}</p>
                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded font-mono">
                          {trigger.link}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}