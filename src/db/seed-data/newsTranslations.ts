import type { Locale } from '@/lib/i18n';

import type { NewsTranslation } from './newsItems';

export const newsTranslations: Record<string, Partial<Record<Locale, NewsTranslation>>> = {
    'muurschildering-metro-gein': {
        en: {
            title: 'Mural at Gein metro station',
            excerpt:
                'A new mural over 60 metres long has appeared at Gein metro station, featuring local plants and animals.',
            content: [
                'A new mural has appeared at Gein metro station. It is over 60 metres long and depicts plants and animals from the area, including the grass snake. Artist Tim Rodermans created the artwork.',
                'Rodermans grew up in Amsterdam and has loved graffiti and painting since childhood. "I already had a connection with Zuidoost, but during this project I got to know so many neighbourhood residents. I spent 3 months on the mural. I enjoyed Gein and how residents care for each other."',
                'Goldcrest, kestrel and field mouse: "Plants and animals are themes that many people find fun and beautiful. The grass snake is very common here, but so are the goldcrest, kestrel, field mouse and hairy bittercress. I always want to combine the abstract and realism in my art. This creates a playful and exciting whole."',
                'Neighbourhood residents are enthusiastic. "I have only received positive reactions, from young and old. That people really enjoy it and find it beautiful. And that it brightens up the neighbourhood. From a rundown spot to a nice, fresh, colourful place."',
                'The mural at Gein metro station is part of a larger plan in Zuidoost. With Zuidoost Underground Art, tunnels and underpasses get lighting, colour and art. Artists from the neighbourhood work together with residents and other parties. This makes routes more pleasant and safer for people who walk or cycle.',
                'Photographer: Kick Smeets'
            ]
        },
        ar: {
            title: 'جدارية في محطة مترو خيـن',
            excerpt:
                'ظهرت جدارية جديدة يزيد طولها على 60 مترًا عند محطة مترو خيـن، تُصوِّر نباتات وحيوانات من المنطقة.',
            content: [
                'ظهرت جدارية جديدة عند محطة مترو خيـن. يزيد طولها على 60 مترًا وتُصوِّر نباتات وحيوانات من المنطقة المحيطة، منها ثعبان العشب. صنع الفنان تيم رودرمانز هذا العمل الفني.',
                'نشأ رودرمانز في أمستردام وأحبّ الغرافيتي والرسم منذ طفولته. "كان لديّ ارتباط بزاودأوست بالفعل، لكنني تعرّفت خلال العمل على كثير من سكان الحي. أمضيت 3 أشهر في رسم الجدارية. استمتعت بخيـن وبطريقة تعلّق السكان ببعضهم."',
                'عصفور الذهب والعُقيّق وفأر الحقل: "النباتات والحيوانات موضوعات يجدها كثيرون ممتعة وجميلة. ثعبان العشب شائع جدًا هنا، وكذلك عصفور الذهب والعُقيّق وفأر الحقل. أريد دائمًا في فنّي أن أجمع بين التجريد والواقعية. هذا يخلق كلًّا مرحًا ومثيرًا."',
                'السكان متحمسون. "لم أتلقَّ إلا ردود فعل إيجابية، من الصغار والكبار. أن الناس يستمتعون بها فعلًا ويجدونها جميلة. وأنها تُبهج الحي. من مكان متردٍّ إلى مكان رائع وملوَّن."',
                'الجدارية عند محطة مترو خيـن جزء من خطة أكبر في زاودأوست. مع مشروع Zuidoost Underground Art تحصل الأنفاق والممرات على إضاءة ولون وفن. يعمل فنانون من الحي مع السكان وأطراف أخرى، مما يجعل المسارات أكثر متعة وأمانًا للمشاة وراكبي الدراجات.',
                'المصوّر: كيك سميتس'
            ]
        }
    },
    'levensloopbestendig-wooncomplex-gein': {
        en: {
            title: 'Future-proof housing in Gein?',
            excerpt: 'Join the co-design sessions for new homes and shared facilities that fit every life stage.',
            content: [
                'Together with residents and care partners we are mapping what a future-proof housing block should look like. Think of ground-floor apartments, extra storage and spaces where neighbours can cook or exercise together.',
                'Design labs and walking interviews teach us what daily life really needs: flexible care, digital support and places to meet informally.',
                'We collect every insight via newsletters and meetings. Your experience helps decide which pilots we scale up in 2026.'
            ]
        },
        ar: {
            title: 'مجمع سكني يناسب كل مراحل الحياة في خيـن؟',
            excerpt: 'انضم إلى جلسات التصميم لنبتكر مساكن وخدمات مشتركة تلائم كل الأعمار.',
            content: [
                'نعمل مع السكان وشركاء الرعاية لرسم ملامح مجمع سكني مستقبلي: شقق منخفضة العتبة، مساحات تخزين إضافية وأماكن يمكن للجيران الطهي أو الرياضة فيها معًا.',
                'تكشف مختبرات التصميم والجولات الميدانية عن احتياجات الحياة اليومية مثل الرعاية المرنة، الدعم الرقمي ومساحات اللقاء غير الرسمي.',
                'نجمع كل الملاحظات عبر النشرات والاجتماعات، فخبرتك تحدد أي التجارب سنوسعها في 2026.'
            ]
        }
    },
    'geen-hoogspanningsstation-gein': {
        en: {
            title: 'Speak up: no power substation next to Gein',
            excerpt: 'Residents campaign to keep Gaasperzoom green, healthy and quiet.',
            content: [
                'Plans for a high-voltage substation raise questions about health, noise and the impact on nature. We bundle every signal from residents and experts.',
                'Together with neighbourhood partners we explain alternative locations, support residents with letters of objection and keep the municipality accountable.',
                'Do you want to add your voice? Visit the walk-in hours at De Ster so we can deliver your concerns directly to decision makers.'
            ]
        },
        ar: {
            title: 'لنحافظ على غاسبرزوم بلا محطة كهرباء',
            excerpt: 'الأهالي يوحدون أصواتهم لحماية البيئة والصحة قرب خيـن.',
            content: [
                'تثير خطط بناء محطة كهرباء عالية الجهد مخاوف حول الصحة والضوضاء وتأثيرها على الطبيعة. نجمع كل الإشارات والشهادات من السكان والخبراء.',
                'بالتعاون مع الشركاء نشرح البدائل، نساعد على صياغة الاعتراضات ونبقي البلدية مسؤولة عن وعودها.',
                'هل تود إضافة صوتك؟ تعال إلى ساعات الاستقبال في دي ستر لننقل مخاوفك مباشرة لصناع القرار.'
            ]
        }
    },
    'maak-gein-levensloopbestendig': {
        en: {
            title: 'Make Gein future-proof for every resident',
            excerpt: 'We experiment with community hubs, digital support and meetings between young and old.',
            content: [
                'Residents, schools and care teams are drawing a roadmap for an inclusive neighbourhood. Shared living rooms, adaptive homes and support at home are core themes.',
                'Pilot programmes in Buurthub De Ster test what works: from neighbourhood concierges to blended care services.',
                'Every six months we share the results and invite new volunteers to scale up successful ideas.'
            ]
        },
        ar: {
            title: 'ليصبح خيـن مناسبًا للجميع',
            excerpt: 'نختبر حاضنات مجتمعية ودعمًا رقميًا ولقاءات بين الأجيال.',
            content: [
                'يرسم السكان والمدارس وفِرق الرعاية خارطة طريق لحي شامل. غرف معيشة مشتركة، مساكن قابلة للتكيف ودعم منزلي هي المحاور الأساسية.',
                'تجاربنا في مركز دي ستر تختبر ما ينجح فعلاً: من سفراء الحي إلى خدمات الرعاية المدمجة.',
                'نشارك النتائج كل ستة أشهر وندعو متطوعين جدد لتوسيع الأفكار التي أثبتت نجاحها.'
            ]
        }
    },
    'activiteitenkalender-gein-bewoners': {
        en: {
            title: 'Activity calendar for Gein',
            excerpt: 'All neighbourhood dinners, sports events and repair cafés in one overview.',
            content: [
                'Schools, churches and sports clubs now share their dates through one central calendar in Buurthub De Ster and online.',
                'It helps residents quickly see where they can volunteer, meet neighbours or get advice.',
                'Organising something new? Register it and we will help with promotion and practical tips.'
            ]
        },
        ar: {
            title: 'تقويم أنشطة خيـن',
            excerpt: 'كل الفعاليات الرياضية والاجتماعية في قائمة واحدة سهلة.',
            content: [
                'تشارك المدارس والكنائس والأندية الرياضية مواعيدها عبر تقويم مركزي في دي ستر وعلى الإنترنت.',
                'يساعد ذلك السكان على معرفة أماكن التطوع أو اللقاء أو طلب المشورة بسرعة.',
                'هل تنظم نشاطًا جديدًا؟ سجله وسنساعدك في الترويج والنصائح العملية.'
            ]
        }
    },
    'terugblik-buurtfeest-gein3dorp': {
        en: {
            title: 'Looking back at the Gein3Dorp neighbourhood party',
            excerpt: 'Burendag became a festival full of music, workshops and shared meals.',
            content: [
                'The field near Cornelis Aarnoutsstraat transformed into a colourful stage where pioneers and new residents met.',
                'Volunteers organised creative workshops, children’s games and storytelling sessions about 40 years of Gein.',
                'Residents now want more of these gatherings, so we are recruiting organisers and local sponsors.'
            ]
        },
        ar: {
            title: 'لمحة عن احتفال حي خيـن3دورب',
            excerpt: 'تحولت يوم الجيران إلى مهرجان مليء بالموسيقى والورش والطعام المشترك.',
            content: [
                'تحول الحقل قرب شارع كورنيليس آرناوتس إلى منصة مليئة بالألوان التقى فيها الرواد والسكان الجدد.',
                'نظم المتطوعون ورشًا إبداعية وألعابًا للأطفال وحكايات عن 40 عامًا من تاريخ خيـن.',
                'يطالب السكان بمزيد من هذه اللقاءات، لذا نبحث عن منظمين ورعاة محليين.'
            ]
        }
    },
    'programma-viering-750-jaar-amsterdam': {
        en: {
            title: 'Programme for 750 years of Amsterdam & 40 years of Gein3Dorp',
            excerpt: 'From morning walks to evening concerts: this was the 27 September line-up.',
            content: [
                'Residents curated a full-day programme on the field near Cornelis Aarnoutsstraat with tours, workshops and local food.',
                'Children enjoyed creative labs while elders shared memories from the early years of the district.',
                'Want to host next year? Sign up now so we can co-create an even stronger jubilee edition.'
            ]
        },
        ar: {
            title: 'برنامج الاحتفال بـ ٧٥٠ عامًا لأمستردام و٤٠ عامًا لخيـن3دورب',
            excerpt: 'من جولات الصباح إلى الحفلات المسائية: هذا ما حدث في ٢٧ سبتمبر.',
            content: [
                'صمم السكان برنامجًا يوميًا كاملًا على الحقل قرب شارع كورنيليس آرناوتس تضمن جولات وورش وطعامًا محليًا.',
                'استمتع الأطفال بمختبرات إبداعية بينما شارك الكبار ذكريات السنوات الأولى للحي.',
                'هل تريد المشاركة في النسخة القادمة؟ سجّل الآن لنخطط معًا لاحتفال أقوى.'
            ]
        }
    },
    'heel-gein-bakt': {
        en: {
            title: 'Bake along with HEEL GEIN BAKT',
            excerpt: 'Local bakers shared recipes and stories during the jubilee weekend.',
            content: [
                'Residents presented cakes from every background, from pom to vegan lemon loaf, and swapped tips with the jury.',
                'The baking challenge was a cheerful way to discuss future youth and senior activities.',
                'Next year we need new bakers and jury members—sign up to receive the playbook.'
            ]
        },
        ar: {
            title: 'خبز خيـن الكبير: شارك بطريقتك',
            excerpt: 'قدم خبازو الحي وصفاتهم وقصصهم خلال عطلة اليوبيل.',
            content: [
                'عرض السكان حلويات من كل الخلفيات، من "بوم" السورينامي إلى كعكة الليمون النباتية، وتبادلوا النصائح مع لجنة التحكيم.',
                'كان التحدي فرصة مرحة للحديث عن أنشطة جديدة للأطفال وكبار السن.',
                'نبحث عن خبازين وأعضاء لجنة جدد للعام المقبل—سجّل لتحصل على دليل التنظيم.'
            ]
        }
    },
    'vier-40-jaar-gein': {
        en: {
            title: 'Celebrating 40 years of Gein together',
            excerpt: 'Why we threw a neighbourhood party and how you can help next year.',
            content: [
                'Every generation contributed photos, music and food to mark four decades of living in Gein.',
                'Story circles captured memories from the first residents while new neighbours shared fresh ideas.',
                'We are still collecting stories and volunteers—email us if you want to help preserve the local history.'
            ]
        },
        ar: {
            title: 'لنحتفل بمرور ٤٠ عامًا على خيـن معًا',
            excerpt: 'هكذا احتفلنا بالحي ولماذا نحتاج دعمك للعام القادم.',
            content: [
                'ساهمت جميع الأجيال بالصور والموسيقى والطعام للاحتفاء بأربعة عقود من الحياة في خيـن.',
                'سجلت حلقات السرد ذكريات السكان الأوائل بينما طرح الجيران الجدد أفكارًا مستقبلية.',
                'ما زلنا نجمع القصص والمتطوعين—راسلنا إن كنت ترغب في حفظ تاريخ الحي.'
            ]
        }
    },
    'zaterdag-bij-de-jumbo': {
        en: {
            title: 'Saturday outreach at the Jumbo supermarket',
            excerpt: 'Games and conversations recruited new volunteers for neighbourhood projects.',
            content: [
                'A shuffleboard table drew shoppers who then heard about buddy projects, festivals and social help lines.',
                'Volunteers explained how they match residents with practical requests or event roles.',
                'Interested in helping? Drop by Buurthub De Ster and we will find a task that fits your time.'
            ]
        },
        ar: {
            title: 'حملة سبت عند سوبرماركت جمبو',
            excerpt: 'ألعاب وحديث مباشر لاستقطاب متطوعين جدد لمبادرات الحي.',
            content: [
                'جذبت طاولة الشوفل المارة الذين تعرفوا بعدها على مشاريع الصحبة والمهرجانات وخطوط المساعدة الاجتماعية.',
                'شرح المتطوعون كيف يربطون السكان بالطلبات العملية أو أدوار الفعاليات.',
                'هل تود التطوع؟ زر مركز دي ستر لنجد مهمة تناسب وقتك.'
            ]
        }
    },
    'herdenking-4-mei-gein3': {
        en: {
            title: 'May 4th commemoration in Gein3',
            excerpt: 'Guido de Bruin shared the story behind street names and resistance heroes.',
            content: [
                'During the May 4th commemoration in Gein3, Guido de Bruin explained how street names refer to resistance heroes from Het Parool, Trouw, De Waarheid and Vrij Nederland.',
                'Residents reflected on the neighbourhood history and the role of resistance fighters who gave their lives for freedom. Children read poems and laid flowers at the monument.',
                'We continue collecting stories to keep the meaning of Gein3Dorp visible. Do you have family stories? Share them with the Neighbourhood Platform.'
            ]
        },
        ar: {
            title: 'إحياء ذكرى 4 مايو في خيـن3',
            excerpt: 'شارك غيدو دي بروين قصة أسماء الشوارع وأبطال المقاومة.',
            content: [
                'خلال إحياء ذكرى 4 مايو في خيـن3، شرح غيدو دي بروين كيف تشير أسماء الشوارع إلى أبطال المقاومة من صحف هت بارول وتراو ودي فارهايد وفراي نيدرلاند.',
                'تأمل السكان في تاريخ الحي ودور مقاتلي المقاومة الذين ضحوا بحياتهم من أجل الحرية. قرأ الأطفال قصائد ووضعوا الزهور عند النصب التذكاري.',
                'نواصل جمع القصص للحفاظ على معنى خيـن3دورب. هل لديك قصص عائلية؟ شاركها مع منصة الحي.'
            ]
        }
    },
    'gein1-schoonste-kant': {
        en: {
            title: 'Gein 1 showed its best side',
            excerpt: 'Residents went out during the National Clean-up Day.',
            content: [
                'On March 22, residents from Gein 1 took to the streets armed with grabbers and garbage bags. The call poster in the hallways ensured a good turnout.',
                'Together they cleaned up green spaces, removed litter and discussed what else could be improved in the neighbourhood.',
                'The action was a success: we are planning new clean-up moments and involving schools and sports clubs to participate.'
            ]
        },
        ar: {
            title: 'أظهر خيـن1 أجمل جوانبه',
            excerpt: 'خرج السكان خلال يوم التنظيف الوطني.',
            content: [
                'في 22 مارس، نزل سكان خيـن1 إلى الشوارع مسلحين بالملاقط وأكياس القمامة. ضمن ملصق الدعوة في المداخل إقبالاً جيدًا.',
                'نظفوا معًا المساحات الخضراء وأزالوا القمامة وناقشوا ما يمكن تحسينه في الحي.',
                'كانت الحملة ناجحة: نخطط لمزيد من لحظات التنظيف ونشرك المدارس والأندية الرياضية للمشاركة.'
            ]
        }
    },
    'oproep-gein3dorp-verhalen': {
        en: {
            title: 'Call: what did you do in Gein3Dorp back then?',
            excerpt: 'For the celebration of 40 years of Gein, we are looking for stories from the early years.',
            content: [
                'Amsterdam is 750 years old and Gein is 40 years old. That is why we are collecting stories and photos from the early years of Gein3Dorp. What do you remember from the first years?',
                'In the Gein3Dorper we publish interviews and photos. We are looking for residents from then and now to fill new sections.',
                'Send your memory or tip to the Neighbourhood Platform, and we will contact you for a conversation or recording.'
            ]
        },
        ar: {
            title: 'نداء: ماذا فعلت في خيـن3دورب في الماضي؟',
            excerpt: 'للاحتفال بمرور 40 عامًا على خيـن، نبحث عن قصص من السنوات الأولى.',
            content: [
                'أمستردام عمرها 750 عامًا وخيـن عمرها 40 عامًا. لذلك نجمع القصص والصور من السنوات الأولى لخيـن3دورب. ماذا تتذكر من السنوات الأولى؟',
                'في صحيفة خيـن3دوربر ننشر المقابلات والصور. نبحث عن سكان من ذلك الوقت والآن لملء أقسام جديدة.',
                'أرسل ذكرياتك أو نصيحتك إلى منصة الحي، وسنتواصل معك لإجراء محادثة أو تسجيل.'
            ]
        }
    },
    'buurtplatform-gein-zoekt-versterking': {
        en: {
            title: 'Neighbourhood Platform Gein seeks reinforcement',
            excerpt: 'We are looking for a treasurer and volunteers with organizational talent.',
            content: [
                'The Neighbourhood Platform is growing and therefore we are looking for reinforcement in the board and working groups. Especially a treasurer and people who want to organize events are welcome.',
                'We work on neighbourhood projects, grant applications and resident initiatives. With your talent we make more impact and keep the neighbourhood moving.',
                'Interested? Email us or drop by Buurthub De Ster for an introduction.'
            ]
        },
        ar: {
            title: 'منصة حي خيـن تبحث عن تعزيزات',
            excerpt: 'نبحث عن أمين صندوق ومتطوعين بموهبة تنظيمية.',
            content: [
                'تنمو منصة الحي ولذلك نبحث عن تعزيزات في مجلس الإدارة ومجموعات العمل. نرحب بشكل خاص بأمين صندوق وأشخاص يرغبون في تنظيم الفعاليات.',
                'نعمل على مشاريع الحي وطلبات المنح ومبادرات السكان. بموهبتك نحقق تأثيرًا أكبر ونبقي الحي متحركًا.',
                'مهتم؟ راسلنا أو زر مركز دي ستر للتعارف.'
            ]
        }
    },
    'gein-is-40-jaar': {
        en: {
            title: 'Gein is 40 years old',
            excerpt: 'A moment to look back and make plans for the coming decades.',
            content: [
                'In 2025 we celebrate that Gein is forty years old. An occasion to honor the pioneers and involve new residents in neighbourhood projects.',
                'We are creating a timeline of events, collecting photos and stories and looking for ways to keep the neighbourhood future-proof.',
                'Join in by sharing your memories or joining working groups preparing festivals, exhibitions and podcasts.'
            ]
        },
        ar: {
            title: 'خيـن عمرها 40 عامًا',
            excerpt: 'لحظة للنظر إلى الوراء ووضع خطط للعقود القادمة.',
            content: [
                'في 2025 نحتفل بأن خيـن عمرها أربعون عامًا. مناسبة لتكريم الرواد وإشراك السكان الجدد في مشاريع الحي.',
                'نصنع جدولاً زمنيًا للأحداث ونجمع الصور والقصص ونبحث عن طرق للحفاظ على الحي مستعدًا للمستقبل.',
                'شارك بمشاركة ذكرياتك أو الانضمام إلى مجموعات العمل التي تحضر المهرجانات والمعارض والبودكاست.'
            ]
        }
    },
    'windmolens-gemeenteraad': {
        en: {
            title: 'Wind turbines in the city council',
            excerpt:
                'On December 11, 2024, the council discussed locations for wind turbines – residents made their voices heard.',
            content: [
                'The city council debated wind turbines in Southeast and possibly in the Gaasperzoom. Residents and action groups wanted to make clear that green space and health should come first.',
                'We shared concerns, alternatives and advocated for better participation. We also called for independent research into noise and shadow flicker.',
                'After the meeting we continue to collect signals and prepare follow-up actions to safeguard livability.'
            ]
        },
        ar: {
            title: 'توربينات الرياح في مجلس البلدية',
            excerpt: 'في 11 ديسمبر 2024، ناقش المجلس مواقع توربينات الرياح – أسمع السكان أصواتهم.',
            content: [
                'ناقش مجلس البلدية توربينات الرياح في الجنوب الشرقي وربما في غاسبرزوم. أراد السكان ومجموعات العمل توضيح أن المساحات الخضراء والصحة يجب أن تأتي أولاً.',
                'شاركنا المخاوف والبدائل ودعونا إلى مشاركة أفضل. دعونا أيضًا إلى بحث مستقل حول الضوضاء وظل الشفرات.',
                'بعد الاجتماع نواصل جمع الإشارات ونحضر إجراءات متابعة لحماية صلاحية العيش.'
            ]
        }
    },
    'gemeente-aansprakelijk-windturbines': {
        en: {
            title: 'Municipality held liable for wind turbine plans',
            excerpt: 'Residents united to prevent damage and obtain legal clarity.',
            content: [
                'Residents joined forces to hold the municipality liable for potential damage from wind turbine plans near residential areas.',
                'Legal steps were taken to ensure proper environmental impact assessments and protect property values and health.',
                'The action shows how collective organization can influence policy decisions and protect neighbourhood interests.'
            ]
        },
        ar: {
            title: 'البلدية مسؤولة عن خطط توربينات الرياح',
            excerpt: 'اتحد السكان لمنع الضرر والحصول على وضوح قانوني.',
            content: [
                'انضم السكان لتحميل البلدية المسؤولية عن الأضرار المحتملة من خطط توربينات الرياح بالقرب من المناطق السكنية.',
                'اتخذت خطوات قانونية لضمان تقييمات بيئية مناسبة وحماية قيم العقارات والصحة.',
                'يظهر الإجراء كيف يمكن للتنظيم الجماعي التأثير على قرارات السياسة وحماية مصالح الحي.'
            ]
        }
    }
};
