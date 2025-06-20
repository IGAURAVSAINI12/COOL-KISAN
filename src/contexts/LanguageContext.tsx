import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.farmers': 'For Farmers',
    'nav.chillerOwners': 'For Chiller Owners',
    'nav.pricing': 'Pricing',
    'nav.about': 'About',
    'nav.login': 'Login',
    
    // About Page
    'about.hero.title': 'Serving Lucknow\'s',
    'about.hero.subtitle': 'Dairy Farmers',
    'about.hero.description': 'CoolKisan is a Lucknow-based startup dedicated to solving milk preservation challenges for local farmers through innovative cooling solutions and community collaboration.',
    'about.hero.location': 'Proudly serving Lucknow, Uttar Pradesh',
    
    'about.stats.farmers': 'Farmers in Lucknow',
    'about.stats.chillers': 'Chillers Connected',
    'about.stats.milk': 'Milk Preserved',
    'about.stats.villages': 'Villages Covered',
    
    'about.mission.title': 'Our Mission',
    'about.mission.description1': 'To create a sustainable ecosystem where every farmer in Lucknow and surrounding areas has access to affordable, reliable milk cooling solutions. We believe that by preserving milk quality, we can improve farmer incomes and reduce food wastage in our region.',
    'about.mission.description2': 'Through technology and community collaboration, we\'re building a network that ensures no farmer in Lucknow has to worry about milk spoilage again.',
    
    'about.mission.reduce.title': 'Reduce Wastage',
    'about.mission.reduce.desc': 'Prevent milk spoilage through proper cooling',
    'about.mission.income.title': 'Increase Income',
    'about.mission.income.desc': 'Help farmers get better prices for quality milk',
    'about.mission.community.title': 'Build Community',
    'about.mission.community.desc': 'Connect farmers with shared resources',
    'about.mission.quality.title': 'Ensure Quality',
    'about.mission.quality.desc': 'Maintain the highest milk quality standards',
    
    'about.values.title': 'Our Values',
    'about.values.subtitle': 'The principles that guide everything we do in serving Lucknow\'s farming community',
    
    'about.values.farmer.title': 'Farmer First',
    'about.values.farmer.desc': 'Every decision we make puts the farmer\'s needs and success at the center.',
    'about.values.quality.title': 'Quality Assurance',
    'about.values.quality.desc': 'We ensure the highest standards of milk preservation and safety.',
    'about.values.innovation.title': 'Innovation',
    'about.values.innovation.desc': 'Continuously improving our technology to serve farmers better.',
    'about.values.community.title': 'Community Focus',
    'about.values.community.desc': 'Building strong connections within the Lucknow farming community.',
    
    'about.areas.title': 'Our Service Areas',
    'about.areas.subtitle': 'Covering key dairy farming regions across Lucknow district',
    'about.areas.central.desc': 'Urban and peri-urban dairy farmers',
    'about.areas.mohanlalganj.desc': 'Traditional dairy farming region',
    'about.areas.malihabad.desc': 'Mixed agriculture with dairy focus',
    'about.areas.bakshi.desc': 'Emerging dairy farming area',
    'about.areas.villages': 'Villages',
    'about.areas.farmers': 'Farmers',
    'about.areas.chillers': 'Chillers',
    
    'about.team.title': 'Meet Our Team',
    'about.team.subtitle': 'Local leaders committed to transforming Lucknow\'s dairy sector',
    'about.team.gaurav.role': 'Founder & CEO',
    'about.team.gaurav.desc': 'A web developer and ideation expert creating tech solutions that boost efficiency and connectivity for farmers and chiller owners.',
    'about.team.rajesh.role': 'Field Work Specialist',
    'about.team.rajesh.desc': 'Field Expert & 2 years of experience in Uttar Pradesh agriculture.',
    'about.team.anita.role': 'Head of Operations',
    'about.team.anita.desc': 'Operations specialist with expertise in supply chain management across UP region.',
    
    'about.impact.title': 'Our Local Impact',
    'about.impact.subtitle': 'Making a difference in Lucknow\'s dairy farming community',
    'about.impact.preservation.title': 'Quality Preservation',
    'about.impact.preservation.desc': 'Helping Lucknow farmers maintain milk quality standards and reduce spoilage by up to 85% through our cooling network.',
    'about.impact.growth.title': 'Income Growth',
    'about.impact.growth.desc': 'Enabling farmers to get better prices for their milk by ensuring quality preservation and connecting them with premium buyers.',
    'about.impact.building.title': 'Community Building',
    'about.impact.building.desc': 'Creating a strong network of farmers and chiller owners across Lucknow, fostering collaboration and mutual support.',
    
    'about.cta.title': 'Join Lucknow\'s Dairy Revolution',
    'about.cta.description': 'Whether you\'re a farmer looking to preserve your milk or someone who wants to contribute to our local farming community, we\'d love to have you on board.',
    'about.cta.farmer': 'Start as Farmer',
    'about.cta.contact': 'Contact Us',
  },
  hi: {
    // Header
    'nav.home': 'होम',
    'nav.farmers': 'किसानों के लिए',
    'nav.chillerOwners': 'चिलर मालिकों के लिए',
    'nav.pricing': 'मूल्य निर्धारण',
    'nav.about': 'हमारे बारे में',
    'nav.login': 'लॉगिन',
    
    // About Page
    'about.hero.title': 'लखनऊ के',
    'about.hero.subtitle': 'डेयरी किसानों की सेवा',
    'about.hero.description': 'कूलकिसान एक लखनऊ-आधारित स्टार्टअप है जो नवाचार शीतलन समाधान और सामुदायिक सहयोग के माध्यम से स्थानीय किसानों के दूध संरक्षण की चुनौतियों को हल करने के लिए समर्पित है।',
    'about.hero.location': 'गर्व से लखनऊ, उत्तर प्रदेश की सेवा कर रहे हैं',
    
    'about.stats.farmers': 'लखनऊ में किसान',
    'about.stats.chillers': 'जुड़े चिलर',
    'about.stats.milk': 'संरक्षित दूध',
    'about.stats.villages': 'कवर किए गए गांव',
    
    'about.mission.title': 'हमारा मिशन',
    'about.mission.description1': 'एक टिकाऊ पारिस्थितिकी तंत्र बनाना जहां लखनऊ और आसपास के क्षेत्रों के हर किसान के पास किफायती, विश्वसनीय दूध शीतलन समाधान तक पहुंच हो। हमारा मानना है कि दूध की गुणवत्ता को संरक्षित करके, हम किसानों की आय में सुधार कर सकते हैं और हमारे क्षेत्र में खाद्य बर्बादी को कम कर सकते हैं।',
    'about.mission.description2': 'प्रौद्योगिकी और सामुदायिक सहयोग के माध्यम से, हम एक ऐसा नेटवर्क बना रहे हैं जो यह सुनिश्चित करता है कि लखनऊ में किसी भी किसान को दूध खराब होने की चिंता न करनी पड़े।',
    
    'about.mission.reduce.title': 'बर्बादी कम करें',
    'about.mission.reduce.desc': 'उचित शीतलन के माध्यम से दूध खराब होने से रोकें',
    'about.mission.income.title': 'आय बढ़ाएं',
    'about.mission.income.desc': 'किसानों को गुणवत्तापूर्ण दूध के लिए बेहतर कीमत दिलाने में मदद करें',
    'about.mission.community.title': 'समुदाय बनाएं',
    'about.mission.community.desc': 'किसानों को साझा संसाधनों से जोड़ें',
    'about.mission.quality.title': 'गुणवत्ता सुनिश्चित करें',
    'about.mission.quality.desc': 'उच्चतम दूध गुणवत्ता मानकों को बनाए रखें',
    
    'about.values.title': 'हमारे मूल्य',
    'about.values.subtitle': 'वे सिद्धांत जो लखनऊ के कृषि समुदाय की सेवा में हमारे हर काम का मार्गदर्शन करते हैं',
    
    'about.values.farmer.title': 'किसान पहले',
    'about.values.farmer.desc': 'हमारा हर निर्णय किसान की जरूरतों और सफलता को केंद्र में रखता है।',
    'about.values.quality.title': 'गुणवत्ता आश्वासन',
    'about.values.quality.desc': 'हम दूध संरक्षण और सुरक्षा के उच्चतम मानकों को सुनिश्चित करते हैं।',
    'about.values.innovation.title': 'नवाचार',
    'about.values.innovation.desc': 'किसानों की बेहतर सेवा के लिए अपनी तकनीक में निरंतर सुधार।',
    'about.values.community.title': 'समुदायिक फोकस',
    'about.values.community.desc': 'लखनऊ कृषि समुदाय के भीतर मजबूत संबंध बनाना।',
    
    'about.areas.title': 'हमारे सेवा क्षेत्र',
    'about.areas.subtitle': 'लखनऊ जिले के प्रमुख डेयरी कृषि क्षेत्रों को कवर करना',
    'about.areas.central.desc': 'शहरी और उप-शहरी डेयरी किसान',
    'about.areas.mohanlalganj.desc': 'पारंपरिक डेयरी कृषि क्षेत्र',
    'about.areas.malihabad.desc': 'डेयरी फोकस के साथ मिश्रित कृषि',
    'about.areas.bakshi.desc': 'उभरता हुआ डेयरी कृषि क्षेत्र',
    'about.areas.villages': 'गांव',
    'about.areas.farmers': 'किसान',
    'about.areas.chillers': 'चिलर',
    
    'about.team.title': 'हमारी टीम से मिलें',
    'about.team.subtitle': 'लखनऊ के डेयरी क्षेत्र को बदलने के लिए प्रतिबद्ध स्थानीय नेता',
    'about.team.gaurav.role': 'संस्थापक और सीईओ',
    'about.team.gaurav.desc': 'उत्तर प्रदेश कृषि में 15 साल के अनुभव के साथ पूर्व डेयरी सहकारी प्रबंधक।',
    'about.team.rajesh.role': 'प्रबंधक',
    'about.team.rajesh.desc': 'ग्रामीण विकास के लिए IoT और मोबाइल एप्लिकेशन में विशेषज्ञता रखने वाले प्रौद्योगिकी विशेषज्ञ।',
    'about.team.anita.role': 'क्षेत्र कार्य विशेषज्ञ',
    'about.team.anita.desc': 'यूपी क्षेत्र में आपूर्ति श्रृंखला प्रबंधन में विशेषज्ञता के साथ संचालन विशेषज्ञ।',
    
    'about.impact.title': 'हमारा स्थानीय प्रभाव',
    'about.impact.subtitle': 'लखनऊ के डेयरी कृषि समुदाय में बदलाव लाना',
    'about.impact.preservation.title': 'गुणवत्ता संरक्षण',
    'about.impact.preservation.desc': 'लखनऊ के किसानों को हमारे शीतलन नेटवर्क के माध्यम से दूध की गुणवत्ता मानकों को बनाए रखने और 85% तक खराबी को कम करने में मदद करना।',
    'about.impact.growth.title': 'आय वृद्धि',
    'about.impact.growth.desc': 'गुणवत्ता संरक्षण सुनिश्चित करके और उन्हें प्रीमियम खरीदारों से जोड़कर किसानों को अपने दूध के लिए बेहतर कीमत पाने में सक्षम बनाना।',
    'about.impact.building.title': 'समुदाय निर्माण',
    'about.impact.building.desc': 'लखनऊ भर में किसानों और चिलर मालिकों का एक मजबूत नेटवर्क बनाना, सहयोग और पारस्परिक समर्थन को बढ़ावा देना।',
    
    'about.cta.title': 'लखनऊ की डेयरी क्रांति में शामिल हों',
    'about.cta.description': 'चाहे आप एक किसान हों जो अपने दूध को संरक्षित करना चाहते हैं या कोई ऐसा व्यक्ति हों जो हमारे स्थानीय कृषि समुदाय में योगदान देना चाहता है, हम आपको अपने साथ रखना पसंद करेंगे।',
    'about.cta.farmer': 'किसान के रूप में शुरुआत करें',
    'about.cta.contact': 'संपर्क करें',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};