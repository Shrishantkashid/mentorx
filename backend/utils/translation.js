// Translation utility for multi-language support
const translations = {
  en: {
    // Common phrases
    "hello": "Hello! I'm your BlockLearn assistant. I can help you navigate the platform, schedule sessions, manage your skills, provide feedback, or answer questions about peer-to-peer learning. What would you like to know?",
    "welcome": "Welcome to BlockLearn!",
    "goodbye": "Goodbye! Thanks for using BlockLearn. Come back anytime you need help with your learning journey!",
    "thanks": "You're very welcome! I'm here whenever you need help with BlockLearn.",
    "ask_anything": "Ask me anything about BlockLearn!",
    "help_with": "I can help with: scheduling sessions, managing skills, updating your profile, providing feedback, becoming a mentor, earning certificates, using the dashboard, finding the right mentor",
    "voice_input": "Voice Input",
    "stop_recording": "Stop Recording",
    "test_voice": "Test Voice",
    "stop_audio": "Stop Audio",
    "auto_speak": "Auto-speak",
    "analytics": "Analytics",
    "new_conversation": "Start New Conversation",
    "language": "Language",
    "listening": "Listening...",
    "recognized": "Recognized",

    // Platform features
    "dashboard": "Your Dashboard shows your learning progress, upcoming sessions, skill development, and recent activity. It's your central hub for tracking your BlockLearn journey.",
    "match": "The Match page uses AI to find the best mentors for your learning goals. It considers your skills needed, preferred learning times, and mentor expertise to suggest optimal matches.",
    "leaderboard": "The leaderboard ranks users based on session feedback, teaching quality, and learning achievements. High ratings help you get priority in matching and showcase your expertise.",
    "sessions": "To schedule a learning session: 1) Go to the Match page, 2) Browse available mentors by skill, 3) Send a session request with your preferred time, 4) Wait for confirmation. You can also view your upcoming sessions in the Sessions page.",
    "skills": "You can manage your skills in the Skills page. Add skills you want to learn (to find mentors) or skills you can teach (to become a mentor). The platform uses AI matching to connect learners with the best mentors for their needs.",
    "profile": "Update your profile in Settings to improve your experience. Add a bio, profile picture, and complete your skills profile. A complete profile helps our matching algorithm find better learning opportunities for you.",
    "feedback": "After completing a session, provide feedback using our animated rating system. This helps maintain quality and improves future matches. You can rate sessions 1-5 stars and choose from emotional feedback options.",
    "mentor": "To become a mentor: 1) Add skills you excel at to 'Skills Offered', 2) Set your availability, 3) Wait for students to request sessions. As a mentor, you help others learn while building your teaching experience and reputation.",
    "certificates": "Earn blockchain-verified certificates by completing learning sessions and achieving skill milestones. These certificates are tamper-proof and can be shared on your professional profiles.",
    "progress": "Track your learning progress in your Dashboard and profile. Complete sessions, earn certificates, and build your skill portfolio. Consistent learning and positive feedback improve your platform reputation.",
    "analytics": "Your learning analytics show: completion rate, skill development trends, mentor ratings, and personalized insights. Check your Dashboard for detailed progress tracking and improvement suggestions.",
    "recommendations": "Based on your learning patterns, I'd recommend exploring: JavaScript, React, Python, or UI/UX Design. These skills are in high demand and build well on each other.",
    "career": "BlockLearn helps with career development by: building practical skills, earning verified certificates, connecting with industry mentors, and tracking your learning journey for your resume."
  },

  es: {
    // Common phrases
    "hello": "¡Hola! Soy tu asistente de BlockLearn. Puedo ayudarte a navegar por la plataforma, programar sesiones, gestionar tus habilidades, proporcionar comentarios o responder preguntas sobre el aprendizaje entre pares. ¿Qué te gustaría saber?",
    "welcome": "¡Bienvenido a BlockLearn!",
    "goodbye": "¡Adiós! Gracias por usar BlockLearn. ¡Vuelve cuando necesites ayuda con tu viaje de aprendizaje!",
    "thanks": "¡De nada! Estoy aquí siempre que necesites ayuda con BlockLearn.",
    "ask_anything": "¡Pregúntame cualquier cosa sobre BlockLearn!",
    "help_with": "Puedo ayudar con: programar sesiones, gestionar habilidades, actualizar perfil, proporcionar comentarios, convertirte en mentor, ganar certificados, usar el panel, encontrar el mentor adecuado",
    "voice_input": "Entrada de Voz",
    "stop_recording": "Detener Grabación",
    "test_voice": "Probar Voz",
    "stop_audio": "Detener Audio",
    "auto_speak": "Habla automática",
    "analytics": "Análisis",
    "new_conversation": "Iniciar Nueva Conversación",
    "language": "Idioma",
    "listening": "Escuchando...",
    "recognized": "Reconocido",

    // Platform features (Spanish translations)
    "dashboard": "Tu Panel muestra tu progreso de aprendizaje, sesiones próximas, desarrollo de habilidades y actividad reciente. Es tu centro principal para rastrear tu viaje en BlockLearn.",
    "match": "La página de Coincidencias usa IA para encontrar los mejores mentores para tus objetivos de aprendizaje. Considera las habilidades que necesitas, horarios preferidos y experiencia del mentor para sugerir coincidencias óptimas.",
    "leaderboard": "El tablero de clasificación clasifica a los usuarios según comentarios de sesiones, calidad de enseñanza y logros de aprendizaje. Las calificaciones altas te ayudan a obtener prioridad en las coincidencias y mostrar tu experiencia.",
    "sessions": "Para programar una sesión de aprendizaje: 1) Ve a la página de Coincidencias, 2) Busca mentores disponibles por habilidad, 3) Envía una solicitud de sesión con tu horario preferido, 4) Espera la confirmación. También puedes ver tus sesiones próximas en la página de Sesiones.",
    "skills": "Puedes gestionar tus habilidades en la página de Habilidades. Agrega habilidades que quieres aprender (para encontrar mentores) o habilidades que puedes enseñar (para convertirte en mentor). La plataforma usa coincidencia con IA para conectar estudiantes con los mejores mentores para sus necesidades.",
    "profile": "Actualiza tu perfil en Configuración para mejorar tu experiencia. Agrega una biografía, foto de perfil y completa tu perfil de habilidades. Un perfil completo ayuda a nuestro algoritmo de coincidencia a encontrar mejores oportunidades de aprendizaje para ti.",
    "feedback": "Después de completar una sesión, proporciona comentarios usando nuestro sistema de calificación animada. Esto ayuda a mantener la calidad y mejora futuras coincidencias. Puedes calificar sesiones de 1-5 estrellas y elegir opciones de comentarios emocionales.",
    "mentor": "Para convertirte en mentor: 1) Agrega habilidades en las que destacas a 'Habilidades Ofrecidas', 2) Establece tu disponibilidad, 3) Espera solicitudes de estudiantes. Como mentor, ayudas a otros a aprender mientras construyes tu experiencia docente y reputación.",
    "certificates": "Gana certificados verificados por blockchain completando sesiones de aprendizaje y logrando hitos de habilidades. Estos certificados son a prueba de manipulación y se pueden compartir en tus perfiles profesionales.",
    "progress": "Rastrea tu progreso de aprendizaje en tu Panel y perfil. Completa sesiones, gana certificados y construye tu portafolio de habilidades. El aprendizaje consistente y comentarios positivos mejoran tu reputación en la plataforma.",
    "analytics": "Tus análisis de aprendizaje muestran: tasa de completitud, tendencias de desarrollo de habilidades, calificaciones de mentores e ideas personalizadas. Revisa tu Panel para rastreo detallado de progreso y sugerencias de mejora.",
    "recommendations": "Basado en tus patrones de aprendizaje, te recomiendo explorar: JavaScript, React, Python o Diseño UI/UX. Estas habilidades están en alta demanda y se complementan bien entre sí.",
    "career": "BlockLearn ayuda con el desarrollo profesional mediante: construcción de habilidades prácticas, obtención de certificados verificados, conexión con mentores de la industria y rastreo de tu viaje de aprendizaje para tu currículum."
  },

  fr: {
    // Common phrases
    "hello": "Bonjour ! Je suis votre assistant BlockLearn. Je peux vous aider à naviguer sur la plateforme, programmer des sessions, gérer vos compétences, fournir des commentaires ou répondre à des questions sur l'apprentissage entre pairs. Que souhaitez-vous savoir ?",
    "welcome": "Bienvenue sur BlockLearn !",
    "goodbye": "Au revoir ! Merci d'utiliser BlockLearn. Revenez quand vous avez besoin d'aide pour votre parcours d'apprentissage !",
    "thanks": "Je vous en prie ! Je suis là quand vous avez besoin d'aide avec BlockLearn.",
    "ask_anything": "Demandez-moi n'importe quoi sur BlockLearn !",
    "help_with": "Je peux aider avec : programmation de sessions, gestion des compétences, mise à jour du profil, fourniture de commentaires, devenir mentor, gagner des certificats, utiliser le tableau de bord, trouver le bon mentor",
    "voice_input": "Entrée Vocale",
    "stop_recording": "Arrêter l'Enregistrement",
    "test_voice": "Tester la Voix",
    "stop_audio": "Arrêter l'Audio",
    "auto_speak": "Parole automatique",
    "analytics": "Analyse",
    "new_conversation": "Commencer Nouvelle Conversation",
    "language": "Langue",
    "listening": "Écoute...",
    "recognized": "Reconnu",

    // Platform features (French translations)
    "dashboard": "Votre Tableau de Bord montre vos progrès d'apprentissage, sessions à venir, développement des compétences et activité récente. C'est votre centre principal pour suivre votre parcours BlockLearn.",
    "match": "La page Match utilise l'IA pour trouver les meilleurs mentors pour vos objectifs d'apprentissage. Elle considère les compétences nécessaires, horaires préférés et expertise du mentor pour suggérer des correspondances optimales.",
    "leaderboard": "Le classement classe les utilisateurs selon les commentaires de session, qualité d'enseignement et réalisations d'apprentissage. Des notes élevées vous aident à obtenir la priorité dans les correspondances et à présenter votre expertise.",
    "sessions": "Pour programmer une session d'apprentissage : 1) Allez à la page Match, 2) Parcourez les mentors disponibles par compétence, 3) Envoyez une demande de session avec votre horaire préféré, 4) Attendez la confirmation. Vous pouvez aussi voir vos sessions à venir dans la page Sessions.",
    "skills": "Vous pouvez gérer vos compétences dans la page Compétences. Ajoutez des compétences que vous voulez apprendre (pour trouver des mentors) ou des compétences que vous pouvez enseigner (pour devenir mentor). La plateforme utilise la correspondance IA pour connecter les apprenants aux meilleurs mentors pour leurs besoins.",
    "profile": "Mettez à jour votre profil dans Paramètres pour améliorer votre expérience. Ajoutez une biographie, photo de profil et complétez votre profil de compétences. Un profil complet aide notre algorithme de correspondance à trouver de meilleures opportunités d'apprentissage pour vous.",
    "feedback": "Après avoir terminé une session, fournissez des commentaires en utilisant notre système de notation animé. Cela aide à maintenir la qualité et améliore les futures correspondances. Vous pouvez noter les sessions de 1 à 5 étoiles et choisir des options de commentaires émotionnels.",
    "mentor": "Pour devenir mentor : 1) Ajoutez des compétences dans lesquelles vous excellez à 'Compétences Offertes', 2) Définissez votre disponibilité, 3) Attendez les demandes des étudiants. En tant que mentor, vous aidez les autres à apprendre tout en développant votre expérience d'enseignement et votre réputation.",
    "certificates": "Gagnez des certificats vérifiés par blockchain en complétant des sessions d'apprentissage et en atteignant des jalons de compétences. Ces certificats sont infalsifiables et peuvent être partagés sur vos profils professionnels.",
    "progress": "Suivez vos progrès d'apprentissage dans votre Tableau de Bord et profil. Terminez des sessions, gagnez des certificats et construisez votre portefeuille de compétences. L'apprentissage cohérent et les commentaires positifs améliorent votre réputation sur la plateforme.",
    "analytics": "Vos analyses d'apprentissage montrent : taux d'achèvement, tendances de développement des compétences, notes de mentors et idées personnalisées. Consultez votre Tableau de Bord pour un suivi détaillé des progrès et des suggestions d'amélioration.",
    "recommendations": "Basé sur vos modèles d'apprentissage, je recommande d'explorer : JavaScript, React, Python ou Design UI/UX. Ces compétences sont très demandées et se complètent bien.",
    "career": "BlockLearn aide au développement professionnel en : construisant des compétences pratiques, gagnant des certificats vérifiés, se connectant avec des mentors de l'industrie et suivant votre parcours d'apprentissage pour votre CV."
  }
};

// Translation function
const translate = (key, language = 'en') => {
  return translations[language]?.[key] || translations.en[key] || key;
};

// Enhanced response function with translation support
const getTranslatedResponse = (responseKey, language = 'en') => {
  return translate(responseKey, language);
};

module.exports = {
  translate,
  getTranslatedResponse,
  supportedLanguages: Object.keys(translations)
};
