import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Filter, SlidersHorizontal, Calendar, CreditCard } from 'lucide-react';
import Layout from '@/components/Layout';
import { useStore } from '@/store/useStore';

export default function Professionals() {
  const { clinics, searchFilters, loadClinics } = useStore();
  const [searchTerm, setSearchTerm] = useState(searchFilters.servico || '');
  const [location, setLocation] = useState(searchFilters.location || '');
  const [selectedServico, setSelectedServico] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Carregar clínicas do backend quando o componente é montado
  useEffect(() => {
    loadClinics();
  }, [loadClinics]);

  const servicosOdontologicos = [
    'Clínica Geral', 'Ortodontia', 'Endodontia', 'Periodontia',
    'Implantodontia', 'Cirurgia Oral', 'Odontopediatria', 'Prótese Dentária',
    'Estética Dental', 'Radiologia Odontológica'
  ];

  const filteredClinics = useMemo(() => {
    let filtered = (clinics || []).filter(clinic => {
      const matchesSearch = clinic.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          clinic.servicos.some(servico => servico.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLocation = !location || 
                            clinic.cidade.toLowerCase().includes(location.toLowerCase()) ||
                            clinic.estado.toLowerCase().includes(location.toLowerCase()) ||
                            clinic.endereco.toLowerCase().includes(location.toLowerCase());
      const matchesServico = !selectedServico || clinic.servicos.includes(selectedServico);
      const clinicPrice = typeof clinic.price === 'string' ? parseFloat(clinic.price) : clinic.price;
      const matchesPrice = clinicPrice >= priceRange[0] && clinicPrice <= priceRange[1];
      
      return matchesSearch && matchesLocation && matchesServico && matchesPrice;
    });

    // Sort clinics
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return (typeof a.price === 'string' ? parseFloat(a.price) : a.price) - (typeof b.price === 'string' ? parseFloat(b.price) : b.price);
        case 'price-high':
          return (typeof b.price === 'string' ? parseFloat(b.price) : b.price) - (typeof a.price === 'string' ? parseFloat(a.price) : a.price);
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [clinics, searchTerm, location, selectedServico, priceRange, sortBy]);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Encontre a Clínica Odontológica Ideal
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Mais de 500 clínicas odontológicas qualificadas prontas para cuidar da sua saúde bucal
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-lg border">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Serviço odontológico ou nome da clínica"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Cidade ou região"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    <span>Filtros</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Filtros</h3>
                
                {/* Serviço Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Serviço Odontológico
                  </label>
                  <select
                    value={selectedServico}
                    onChange={(e) => setSelectedServico(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos os serviços</option>
                    {servicosOdontologicos.map(servico => (
                      <option key={servico} value={servico}>
                        {servico}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Faixa de Preço: R$ {priceRange[0]} - R$ {priceRange[1]}
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Sort Options */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Ordenar por
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="rating">Melhor avaliação</option>
                    <option value="price-low">Menor preço</option>
                    <option value="price-high">Maior preço</option>
                    <option value="experience">Mais experiência</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                    onClick={() => {
                      setSearchTerm('');
                      setLocation('');
                      setSelectedServico('');
                      setPriceRange([0, 1000]);
                      setSortBy('rating');
                    }}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Limpar Filtros
                  </button>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {filteredClinics.length} clínicas encontradas
                </p>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtros</span>
                </button>
              </div>

              {/* Clinics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(filteredClinics || []).map((clinic) => (
                  <div key={clinic.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <img
                          src={clinic.avatar}
                          alt={clinic.nomeFantasia}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {clinic.nomeFantasia}
                          </h3>
                          <p className="text-blue-600 font-medium mb-1">
                            {clinic.servicos[0]}{clinic.servicos.length > 1 && ` +${clinic.servicos.length - 1}`}
                          </p>
                          <p className="text-sm text-gray-500 mb-2">
                            {clinic.cro} • {clinic.cidade}, {clinic.estado}
                          </p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-semibold text-sm">{clinic.rating}</span>
                              <span className="text-gray-500 text-sm">({clinic.reviewCount})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {clinic.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {(clinic.servicos || []).slice(0, 3).map(servico => (
                          <span key={servico} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {servico}
                          </span>
                        ))}
                        {clinic.servicos.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            +{clinic.servicos.length - 3}
                          </span>
                        )}
                      </div>
                      
                      {/* Availability */}
                      <div className="flex items-center space-x-4 mb-4 text-sm">
                        <div className="flex items-center space-x-1 text-green-600">
                          <Calendar className="w-4 h-4" />
                          <span>Disponível hoje</span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-600">
                          <CreditCard className="w-4 h-4" />
                          <span>Parcela em 24x</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
                            R$ {clinic.price}
                          </span>
                          <span className="text-sm text-gray-500 ml-1 block">
                            ou 12x de R$ {((typeof clinic.price === 'string' ? parseFloat(clinic.price) : clinic.price) / 12).toFixed(0)}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/clinic/${clinic.id}`}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                          >
                            Ver Perfil
                          </Link>
                          <Link
                            to={`/booking/${clinic.id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                          >
                            Agendar
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* No Results */}
              {filteredClinics.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhuma clínica encontrada
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Tente ajustar os filtros ou termos de busca
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setLocation('');
                      setSelectedServico('');
                      setPriceRange([0, 1000]);
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Limpar Filtros
                  </button>
                </div>
              )}

              {/* Load More */}
              {filteredClinics.length > 0 && (
                <div className="text-center mt-12">
                  <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                    Carregar Mais Clínicas
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}