import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Target,
  Users,
  Globe,
  Award,
  Lightbulb,
  Shield,
  TrendingUp,
  MapPin,
  Building,
  Truck,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: t('about.values.farmer.title'),
      description: t('about.values.farmer.desc'),
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: t('about.values.quality.title'),
      description: t('about.values.quality.desc'),
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.desc'),
    },
    {
      icon: <Globe className="h-8 w-8 text-green-500" />,
      title: t('about.values.community.title'),
      description: t('about.values.community.desc'),
    },
  ];

  const team = [
    {
      name: 'Gaurav Saini',
      role: t('about.team.gaurav.role'),
      description: t('about.team.gaurav.desc'),
    },
    {
      name: 'Kunwar Aditya Singh',
      role: t('about.team.rajesh.role'),
      description: t('about.team.rajesh.desc'),
    },
    {
      name: 'Funtastic Four',
      role: t('about.team.anita.role'),
      description: t('about.team.anita.desc'),
    },
  ];

  const stats = [
    { number: '2,500+', label: t('about.stats.farmers') },
    { number: '150+', label: t('about.stats.chillers') },
    { number: '500K L', label: t('about.stats.milk') },
    { number: '25+', label: t('about.stats.villages') },
  ];

  const serviceAreas = [
    {
      area: 'Central Lucknow',
      villages: 8,
      farmers: 650,
      chillers: 35,
      description: t('about.areas.central.desc')
    },
    {
      area: 'Mohanlalganj',
      villages: 12,
      farmers: 850,
      chillers: 42,
      description: t('about.areas.mohanlalganj.desc')
    },
    {
      area: 'Malihabad',
      villages: 15,
      farmers: 720,
      chillers: 38,
      description: t('about.areas.malihabad.desc')
    },
    {
      area: 'Bakshi Ka Talab',
      villages: 10,
      farmers: 480,
      chillers: 25,
      description: t('about.areas.bakshi.desc')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            {t('about.hero.title')}
            <br />
            <span className="text-blue-200">{t('about.hero.subtitle')}</span>
          </h1>
          <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('about.hero.description')}
          </p>
          <div className="flex items-center justify-center mb-8">
            <MapPin className="h-6 w-6 text-blue-200 mr-2" />
            <span className="text-lg text-blue-100">{t('about.hero.location')}</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {t('about.mission.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {t('about.mission.description1')}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.mission.description2')}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t('about.mission.reduce.title')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('about.mission.reduce.desc')}
                  </p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t('about.mission.income.title')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('about.mission.income.desc')}
                  </p>
                </div>
                <div className="text-center">
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t('about.mission.community.title')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('about.mission.community.desc')}
                  </p>
                </div>
                <div className="text-center">
                  <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t('about.mission.quality.title')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('about.mission.quality.desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('about.values.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('about.areas.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('about.areas.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {serviceAreas.map((area, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                      <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                      {area.area}
                    </h3>
                    <p className="text-gray-600 text-sm">{area.description}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{area.villages}</div>
                    <div className="text-sm text-gray-600">{t('about.areas.villages')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{area.farmers}</div>
                    <div className="text-sm text-gray-600">{t('about.areas.farmers')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{area.chillers}</div>
                    <div className="text-sm text-gray-600">{t('about.areas.chillers')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('about.team.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('about.team.subtitle')}
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Impact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('about.impact.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('about.impact.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-blue-50 rounded-2xl p-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('about.impact.preservation.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.impact.preservation.desc')}
              </p>
            </div>
            <div className="text-center bg-green-50 rounded-2xl p-8">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('about.impact.growth.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.impact.growth.desc')}
              </p>
            </div>
            <div className="text-center bg-purple-50 rounded-2xl p-8">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('about.impact.building.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.impact.building.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {t('about.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('about.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login?type=farmer"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {t('about.cta.farmer')}
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg"
            >
              {t('about.cta.contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;