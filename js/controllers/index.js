'use strict';

function is_greater(value, param) {
    return value >= param;
}

function is_lower(value, param) {
    return value < param;
}

function is_equal(value, param) {
    return value === param;
}

function is_in(value, param) {
    var result = false;

    angular.forEach(param, function (val) {
        if (val === value)
            result = true;
    });
    return result;
}

function is_not(value, param) {
    var result = true;

    angular.forEach(param, function (val) {
        if (val === value)
            result = false;
    });
    return result;
}

function or(value, param, user) {
    var result = false;

    angular.forEach(param, function (check) {
        var target = user[check.target];

        result = result || check.function(target, check.param, user);
    });
    return result;
}

function and(value, param, user) {
    var result = true;

    angular.forEach(param, function (check) {
        var target = user[check.target];

        result = result && check.function(target, check.param, user);
    });
    return result;
}

var helps = [
    {
        'name': 'Prime d\'activité',
        'description': 'La prime d\'activité est une aide mensuelle pour compléter vos revenus si vous travaillez et que votre salaire est inférieur à une certaine valeur',
        'simulator': 'http://www.caf.fr/allocataires/mes-services-en-ligne/estimer-vos-droits/simulation-prime-d-activite',
        'ask': 'http://primeactivite.fr/demande-prime-activite-formulaire/',
        'checks': [
            {
                'function': is_greater,
                'target': 'age',
                'param': 18
            },
            {
                'function': is_in,
                'target': 'nationality',
                'param': [
                    'french',
                    'resident',
                    'sejour',
                    'eee'
                ]
            },
            {
                'function': is_in,
                'target': 'country',
                'param': [
                    'metrop',
                    'dom'
                ]
            },
            {
                'function': is_in,
                'target': 'work',
                'param': [
                    'part',
                    'full',
                    'entrepreneur',
                    'autoentrepreneur',
                    'learn',
                    'intern'
                ]
            },
            {
                'function': function (val, param, user) {
                    var earned = user.rsa + user.wages + user.pole_wages + user.apl + user.aah + user.rente + user.family_partner_wages;

                    var max = 0;
                    var min = 0;

                    if (user.work === 'learn' || user.work === 'intern')
                        min = 800;
                    if (user.family_status === 'single' && user.family_childs === 0)
                        max = 1500;
                    else if (user.family_partner_work === 'no' || (user.family_status === 'single' && user.family_childs > 0))
                        max = 2200;
                    else if (user.family_partner_work === 'yes' && user.family_childs === 0)
                        max = 1500;
                    else if (user.family_partner_work === 'yes')
                        max = 2900;

                    return earned >= min && earned <= max;
                },
                'target': 'apl',
                'param': ''
            }
        ]
    },
    /*{
        'name': '',
        'description': '',
        'simulator': '',
        'ask': '',
        'checks': [
            {
                'function': function (val, param, user) {},
                'target': '',
                'param': ''
            }
        ]
    },*/
    {
        'name': 'Revenu de Solidarité Active (RSA)',
        'description': 'Le RSA est une aide qui prends le relai des indemnités chomage à la fin de la période de droit. Elle est versée sans limitation de durée aux personnes entrant dans ses conditions d\'attribution.',
        'simulator': '',
        'ask': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_15481.do',
        'checks': [
            {
                'function': is_greater,
                'target': 'age',
                'param': 25
            },
            {
                'function': is_in,
                'target': 'nationality',
                'param': [
                    'french',
                    'resident',
                    'sejour'
                ]
            },
            {
                'function': is_in,
                'target': 'country',
                'param': [
                    'metrop',
                    'dom'
                ]
            },
            {
                'function': is_equal,
                'target': 'work',
                'param': [
                    'unemployed'
                ]
            }
        ]
    },
    {
        'name': 'Revenu de Solidarité Active (RSA) jeune',
        'description': 'Le RSA est une aide qui prends le relai des indemnités chomage à la fin de la période de droit. Elle est versée sans limitation de durée aux personnes entrant dans ses conditions d\'attribution. Attention : dans le cadre des personnes de moins de 25 ans, cette aide ne peut être accordée que si vous avez travaillé de manière rémunérée durant les dernières années, ou si vous avez seul·e la charge d\'un enfant.',
        'simulator': '',
        'ask': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_15481.do',
        'checks': [
            {
                'function': is_lower,
                'target': 'age',
                'param': 25
            },
            {
                'function': is_greater,
                'target': 'age',
                'param': 18
            },
            {
                'function': is_in,
                'target': 'nationality',
                'param': [
                    'french',
                    'resident',
                    'sejour'
                ]
            },
            {
                'function': is_in,
                'target': 'country',
                'param': [
                    'metrop',
                    'dom'
                ]
            },
            {
                'function': is_equal,
                'target': 'work',
                'param': 'unemployed'
            }
        ]
    },
    {
        'name': 'Aide au déménagement',
        'description': 'L\'aide au déménagement est un dispositif destiné à vous aider à vous déplacer dans une nouvelle ville afin de répondre à une offre d\'emploi ou une création d\'entreprise. Elle est possible lorsque vous déménager en étant inscrit à Pôle Emploi, en ayant un contrat de travail (ou une création d\'entreprise), et que votre nouveau lieu de travail se situe à plus de 60km de votre habitation.',
        'simulator': '',
        'ask': '',
        'ask_text': 'La demande doit être faite à votre agence Pôle Emploi',
        'checks': [
            {
                'function': is_equal,
                'target': 'work',
                'param': 'willbe'
            },
            {
                'function': is_equal,
                'target': 'pole',
                'param': 'yes'
            }
        ]
    },
    {
        'name': 'Aide aux transports',
        'description': 'L\'aide au transports est une aide versée durant les 3 premiers mois de votre reprise d\'emploi, qui vient vous indemniser pour vos trajets professionnels. Elle ne peut être versée que si votre nouveau lieu de travail se situe à plus de 60km de votre domicile.',
        'simulator': '',
        'ask': '',
        'ask_text': 'La demande doit être faite à votre agence Pôle Emploi',
        'checks': [
            {
                'function': is_equal,
                'target': 'work',
                'param': 'willbe'
            },
            {
                'function': is_equal,
                'target': 'pole',
                'param': 'yes'
            }
        ]
    },
    {
        'name': 'Aide au double loyer',
        'description': 'L\'aide au double loyer a pour but de vous accompagner dans votre installation plus proche de votre nouveau lieu de travail, lors du retour à l\'emploi. Elle viendra ainsi payer les notes d\'hôtel, éventuellement un premier loyer, les ouvertures de compteurs EDF-GDF, et ainsi de suite. Elle ne peut être versée que si votre nouveau lieu de travail se situe à plus de 60km de votre domicile.',
        'simulator': '',
        'ask': '',
        'ask_text': 'La demande doit être faite à votre agence Pôle Emploi',
        'checks': [
            {
                'function': is_equal,
                'target': 'work',
                'param': 'willbe'
            },
            {
                'function': is_equal,
                'target': 'pole',
                'param': 'yes'
            }
        ]
    },
    {
        'name': 'Aide au premis de conduire',
        'description': 'L\'aide au permis de conduire est un outil visant à vous permettre de financer le passage de votre permis afin de vous aider dans votre recherche d\'emploi.',
        'simulator': '',
        'ask': '',
        'ask_text': 'La demande doit être faite à votre agence Pôle Emploi',
        'checks': [
            {
                'function': is_equal,
                'target': 'pole',
                'param': 'yes'
            },
            {
                'function': is_lower,
                'target': 'pole_wages',
                'param': 501
            }
        ]
    },
    {
        'name': 'Aide à la recherche du premier emploi',
        'description': 'Si vous avez été diplômé·e depuis moins de 4 mois, que vous ne reprennez pas vos études, que vous êtes boursier·e et que vous ne touchez aucune autre aide (RSA, chômage, garantie jeune…) vous pouvez demander à bénéficier d\'une aide versée sur une durée de quatre mois pour vous accompagner dans la recherche d\'un emploi.',
        'simulator': '',
        'ask': 'https://www.messervices.etudiant.gouv.fr/envole/portal/index.php#tab/1',
        'checks': [
            {
                'function': is_lower,
                'target': 'age',
                'param': 28
            },
            {
                'function': is_equal,
                'target': 'work',
                'param': 'unemployed'
            }
        ]
    },
    {
        'name': 'Garantie jeune',
        'description': 'Cette aide, destinée aux jeunes en très grande précarité, ne peut être obtenue que par les personnes ne recevant aucun soutien financier de la part de leur famille. Elle est versée par la mission locale et vous devez donc vous rapprocher de celle de votre département pour en bénéficier.',
        'simulator': '',
        'ask': '',
        'ask_text': 'Vous devez contacter la mission locale de votre département',
        'checks': [
            {
                'function': is_lower,
                'target': 'age',
                'param': 26
            },
            {
                'function': is_greater,
                'target': 'age',
                'param': 16
            },
            {
                'function': is_equal,
                'target': 'work',
                'param': 'unemployed'
            },
            {
                'function': function (val, param, user) {
                    return (user.wages + user.pole_wages) < param
                },
                'target': 'wages',
                'param': 413.37
            },
            {
                'function': is_not,
                'target': 'home',
                'param': [
                    'parents'
                ]
            }
        ]
    },
    {
        'name': 'OpenClassroom',
        'description': 'Pour toutes les personnes inscrites comme demandeur·euse·s d\'emploi, il est possible de bénéficier gratuitement de formation en ligne en informatique et développement web via le site OpenClassroom, leader européen du domaine des formations en ligne.',
        'simulator': '',
        'ask': 'https://openclassrooms.com/pole-emploi/partenariat',
        'checks': [
            {
                'function': is_equal,
                'target': 'pole',
                'param': 'yes'
            }
        ]
    },
    {
        'name': 'Allocations familiales',
        'description': 'Ces aides sont versées par la CAF pour aider à l\'éducation de vos enfants. Elles sont perceptibles jusqu\'à ce que vos enfants aient 20 ans, et augmentent à partir de leurs 14 ans.',
        'simulator': '',
        'ask': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationsfamilialesouchangementdesituation',
        'checks': [
            {
                'function': is_in,
                'target': 'nationality',
                'param': [
                    'french',
                    'resident',
                    'sejour',
                    'eee'
                ]
            },
            {
                'function': is_in,
                'target': 'country',
                'param': [
                    'metrop',
                    'dom'
                ]
            },
            {
                'function': or,
                'target': 'age',
                'param': [
                    {
                        'function': and,
                        'target': 'family_childs',
                        'param': [
                            {
                                'function': is_equal,
                                'target': 'country',
                                'param': 'dom'
                            },
                            {
                                'function': is_greater,
                                'target': 'family_childs',
                                'param': 1
                            }
                        ]
                    },
                    {
                        'function': is_greater,
                        'target': 'family_childs',
                        'param': 2
                    }
                ]
            }
        ]
    },
    {
        'name': 'Prime à la naissance ou à l\'adoption',
        'description': 'La prime a la naissance ou à l\'adoption est une aide versée par la CAF pour chaque nouvel enfant dans votre foyer, sous conditions de ressources. Attention, les ressources prises en compte sont celles de l\'an actuel moins 2 (donc en 2017, ce sont les ressources 2015)',
        'simulator': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lapaje/!ut/p/a1/lZDBbsIwEES_hS_YDSbBOaYxiU1ESJW2YF8itwrIEDtVipD4-zrqCSRA3dvqzc6MFhRsQTl9Nnt9Mr3T3birqKnWQc6LGnNcTCkKjhXh_IMgDb1ARg3emQTh8fUS1L7rP33QBtS1llUMRYzLIo7DIC-CG06zNPM8ZKx8FT6KPOH4xx80LXlvW5Ag53cbz6bw7vrB-r716Lcb7DF1epd8je8CObTGmZPRnflphxsrygiiINVLmpVrRBr9x-rbbi-1OMykbVZvyWTyCxuUs7E!/dl5/d5/L0lDU0NTSUtVSkNncFJBISEvb0VvUUFBSVFKQUFNVWdnR0dRWkRncENsd1FBIS80SkNoRDJtWVJ5RUlSU1pDbEdveC9aN19QTzFHSEtTMEc4RDMwMEkzUEJDRk5PMDA4Ni9aNl9QTzFHSEtTMEcwRTI4MElIMFAzSEhWMzA4NS9ub3JtYWwvZnJta0NuYWZBY3Rpb24vcmVpbml0aWFsaXNlcg!!/',
        'ask': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/demanderprimenaissance/!ut/p/a1/hZJRb4IwEMc_yx54xJ7AmOytysCOzaJopn1ZqhYkwWIKavz2FmJiXKb2pb3e75-7-7eIoTlikh_yjNd5KXnRxMz9jWk3HEYJhHSKXcCUUP_7a2IBdTWw0ADcWRhavTt0wq4XQRRGXgCYjJLI6YMNsXXRPwBu9L3Z1GrSEzuhHxZ4DvpB7LbFXjAIgHivvj8aE92C_QyAC_BohmdTfCKWFeWyNWyB5dLuZYgpkQolVGev9PWmrnfvBhhwPB47K552UmUAL4pyxWueK1EZsBWVWQl1yFf6IKRZ5JkUBqRN2txLYa7Flst1s5s7rajbR_qv4qasajS_VkIL7fLbXRtj-AtQP_EA4yCckr5GQ-sCXE2EyNEfIcaDeDK2wbHQbjubQ05MtjzZJ5K9nAFNX_uA/',
        'checks': [
            {
                'function': is_equal,
                'target': 'pregnant',
                'param': 'yes'
            },
            {
                'function': function (val, param, user) {
                    var max = 35872 + (6469 * user.family_childs);

                    if (user.family_status === 'single' || user.family_partner_work === 'yes')
                        max += 9703;
                    return (user.wages + user.pole_wages + user.family_partner_wages) <= (max / 12);
                },
                'target': 'apl',
                'param': ''
            }
        ]
    },
    {
        'name': 'Aide à la garde d\'enfant',
        'description': 'L\'Aide à la Garde d\'Enfant pour Parent Isolé (Agepi) est une aide proposée par pôle emploi pour les personnes ayant un ou plusieurs enfants de moins de 10 ans, afin de les aider à assurer la garde de leur enfant pendant leur recherche d\'emploi.',
        'simulator': '',
        'ask': '',
        'ask_text': 'Vous devez faire la demande à votre conseillier·e Pôle Emploi',
        'checks': [
            {
                'function': is_equal,
                'target': 'family_status',
                'param': 'single'
            },
            {
                'function': is_greater,
                'target': 'family_childs',
                'param': 1
            },
            {
                'function': is_in,
                'target': 'work',
                'param': [
                    'willbe',
                    'part',
                    'full',
                    'entrepreneur',
                    'autoentrepreneur',
                    'formation'
                ]
            },
            {
                'function': or,
                'target': 'apl',
                'param': [
                    {
                        'function': is_equal,
                        'target': 'pole',
                        'param': 'yes'
                    },
                    {
                        'function': or,
                        'target': 'apl',
                        'param': [
                            {
                                'function': is_greater,
                                'target': 'aah',
                                'param': 1
                            },
                            {
                                'function': is_greater,
                                'target': 'rsa',
                                'param': 1
                            },
                            {
                                'function': is_greater,
                                'target': 'pole_wages',
                                'param': 1
                            }
                        ]
                    },
                    {
                        'function': is_in,
                        'target': 'work',
                        'param': [
                            'entrepreneur',
                            'autoentrepreneur'
                        ]
                    }
                ]
            }
        ]
    },
    {
        'name': 'Allocation de soutien familial',
        'description': 'L\'allocation de soutien familial est destinée aux personnes élevant seul·e·s un enfant de moins de 20 ans. Elle est versé sans condition de ressources.',
        'simulator': '',
        'ask': 'http://wwwd.caf.fr/pdfj/asf.pdf',
        'checks': [
            {
                'function': is_in,
                'target': 'country',
                'param': [
                    'metrop',
                    'dom'
                ]
            },
            {
                'function': is_equal,
                'target': 'family_status',
                'param': 'single'
            },
            {
                'function': is_equal,
                'target': 'family_pension',
                'param': 0
            },
            {
                'function': is_greater,
                'target': 'family_childs',
                'param': 1
            }
        ]
    },
    {
        'name': 'Carte famille nombreuse',
        'description': 'Cette carte est fournie par la SNCF pour aider les familles ayant au moins trois enfants à voyager. Outre une réduction du prix des trains, elle permet d\'obtenir des réductions dans de nombreuses enseignes (Auchan, Flunch, Parc Asterix...)',
        'ask': 'https://secure.voyages-sncf.com/carte-familles-nombreuses/remplir-formulaire/etape1',
        'checks': [
            {
                'function': is_greater,
                'target': 'family_childs',
                'param': 3
            },
            {
                'function': is_in,
                'target': 'country',
                'param': [
                    'desktop',
                    'dom'
                ]
            }
        ]
    },
    {
        'name': 'Congé de solidarité familiale',
        'description': 'Ce congé exceptionnel, payé par la CPAM, vous permet d\'accompagner un·e proche en fin de vie, après le diagnostique d\'une maladie incurable.',
        'ask': 'http://www.ameli.fr/fileadmin/user_upload/formulaires/S3708.pdf',
        'checks': [
            {
                'function': is_equal,
                'target': 'nde',
                'param': 'yes'
            },
            {
                'function': is_in,
                'target': 'work',
                'param': [
                    'unemployed',
                    'willbe',
                    'part',
                    'full',
                    'entrepreneur',
                    'autoentrepreneur'
                ]
            }
        ]
    },
    {
        'name': 'Aide à la complémentaire santé',
        'description': 'Destinée aux personne à faible revenus mais ne pouvant pas bénéficier de la CMU-C, l\'Aide à la complémentaire santé (ACS) se présente sous forme de chèque santé à déduire des cotisations à une mutuelle.',
        'ask': 'http://allocation-chomage.fr/wp-content/uploads/2016/09/dossier-acs-80.pdf',
        'simulator': 'https://www.ameli.fr/simulateur-droits',
        'checks': [
            {
                'function': is_in,
                'target': 'country',
                'param': [
                    'metrop',
                    'dom'
                ]
            },
            {
                'function': is_in,
                'target': 'nationality',
                'param': [
                    'french',
                    'resident',
                    'sejour',
                    'asking',
                    'eee'
                ]
            },
            {
                'function': function (val, param, user) {
                    var earned = user.wages + user.family_partner_wages + user.pole_wages;
                    var min = 0;
                    var max = 0;
                    var people = 1 + user.family_childs;

                    if (user.family_status !== 'single')
                        people++;
                    if (people === 1)
                    {
                        min = 727;
                        if (user.country === 'dom')
                            max = 1092;
                        else
                            max = 981;
                    }
                    else if (people === 2)
                    {
                        min = 1090;
                        if (user.country === 'dom')
                            max = 1638;
                        else
                            max = 1472;
                    }
                    else if (people === 3)
                    {
                        min = 1308;
                        if (user.country === 'dom')
                            max = 1966;
                        else
                            max = 1766;
                    }
                    else if (people === 4)
                    {
                        min = 1527;
                        if (user.country === 'dom')
                            max = 2294;
                        else
                            max = 2061;
                    }
                    else {
                        var new_count = people - 4;

                        min = 1527 + (new_count * 436.89);
                        if (user.country === 'dom')
                            max = 2294 + (new_count * 436.89);
                        else
                            max = 2061 + (new_count * 392.54)
                    }

                    if (user.home === "parents" || user.home === "free" || user.home === "own")
                    {
                        if (people === 1) {
                            min += 64.41;
                            max += 64.41;
                        } else if (people === 2) {
                            min += 112.72;
                            max += 112.72;
                        } else {
                            min += 135.27;
                            max += 135.27;
                        }
                    } else if (user.apl > 0) {
                        if (people === 1) {
                            min += 64.41;
                            max += 64.41;
                        } else if (people === 2) {
                            min += 128.83;
                            max += 128.83;
                        } else {
                            min += 128.83;
                            max += 128.83;
                        }
                    }

                    return earned > min && earned < max;
                }
            }
        ]
    },
    {
        'name': 'CMU-C',
        'description': 'Destinée aux personnes ayant des revenus très faibles, la CMU-C permet d\'obtenir un dispense totale d\'avance pour tous les frais médicaux, ainsi qu\'une prise en charge à 100% de tous les frais médicaux.',
        'ask': 'https://www.aide-sociale.fr/wp-content/uploads/2012/04/demande-cmu-dossier-cmu.pdf',
        'simulator': 'https://www.ameli.fr/simulateur-droits',
        'checks': [
            {
                'function': is_in,
                'target': 'country',
                'param': [
                    'metrop',
                    'dom'
                ]
            },
            {
                'function': is_in,
                'target': 'nationality',
                'param': [
                    'french',
                    'resident',
                    'sejour',
                    'asking',
                    'eee'
                ]
            },
            {
                'function': function (val, param, user) {
                    var earned = user.wages + user.family_partner_wages + user.pole_wages;
                    var max = 0;
                    var people = 1 + user.family_childs;

                    if (user.family_status !== 'single')
                        people++;
                    if (people === 1)
                    {
                        max = 727;
                    }
                    else if (people === 2)
                    {
                        max = 1090;
                    }
                    else if (people === 3)
                    {
                        max = 1308;
                    }
                    else if (people === 4)
                    {
                        max = 1527;
                    }
                    else {
                        var new_count = people - 4;

                        max = 1527 + (new_count * 436.89);
                    }

                    if (user.home === "parents" || user.home === "free" || user.home === "own")
                    {
                        if (people === 1) {
                            max += 64.41;
                        } else if (people === 2) {
                            max += 112.72;
                        } else {
                            max += 135.27;
                        }
                    } else if (user.apl > 0) {
                        if (people === 1) {
                            max += 64.41;
                        } else if (people === 2) {
                            max += 128.83;
                        } else {
                            max += 128.83;
                        }
                    }

                    return earned < max;
                }
            }
        ]
    },
    {
        'name': 'Allocation aux Adultes Handicapé·e·s',
        'description': 'L\'allocation aux adultes handicapé·e·s est une aide ayant pour but de compenser un handicap qui vous empêcherais de travailler. Son montant est dégressif en fonction des ressources, et elle n\'est versée qu\'après validation de la MDPH.',
        'ask': 'Demande à faire à la MDPH de votre région',
        'checks': [
            {
                'function': is_greater,
                'target': 'invalidity',
                'param': 80
            },
            {
                'function': is_equal,
                'target': 'aah',
                'param': 0
            },
            {
                'function': is_greater,
                'target': 'age',
                'param': 20
            },
            {
                'function': is_in,
                'target': 'country',
                'param': [
                    'metrop',
                    'dom'
                ]
            },
            {
                'function': is_in,
                'target': 'nationality',
                'param': [
                    'french',
                    'resident',
                    'sejour',
                    'eee'
                ]
            },
            {
                'function': function (val, param, user) {
                    var earned = user.rsa + user.wages + user.pole_wages + user.apl + user.aah + user.rente + user.family_partner_wages;
                    var max = 9730.68;

                    if (user.family_status !== "single")
                        max = 19461.36;
                    max = max + 4850.76 * user.family_childs;
                    return earned <= (max / 12);
                },
                'target': 'age',
                'param': ''
            }
        ]
    },
    {
        'name': 'Allocation d\'éducation de l\'enfant handicapé',
        'description': 'Cette allocation, qui n\'est pas soumise à des conditions de ressources, permet d\'aider à la prise en charge des coûts liés à l\'éducation d\'un·e enfant handicapé·e.',
        'ask': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_13788.do',
        'checks': [
            {
                'function': is_in,
                'target': 'invalidity_child',
                'param': [
                    'eighty',
                    'fifty_help'
                ]
            },
            {
                'function': is_in,
                'target': 'country',
                'param': [
                    'metrop',
                    'dom'
                ]
            }
        ]
    },
    {
        'name': 'PUMA (ancienne CMU)',
        'description': 'L\'affiliation à la PUMA vous permet de bénéficier d\'un régime de santé sociale et de bénéficier des droits afférents, en particulier en ce qui concerne les prestations de santé.',
        'ask': 'http://www.ameli.fr/fileadmin/user_upload/formulaires/736.cnamts.pdf',
        'checks': [
            {
                'function': is_equal,
                'target': 'health_regime',
                'param': 'none'
            },
            {
                'function': is_in,
                'target': 'country',
                'param': [
                    'metrop',
                    'dom'
                ]
            },
            {
                'function': is_in,
                'target': 'nationality',
                'param': [
                    'french',
                    'resident',
                    'sejour',
                    'eee'
                ]
            }
        ]
    },
    {
        'name': 'Bilan santé gratuit',
        'description': 'Toutes les personnes assurées à la CPAM ou à la MSA, quels que soient leurs revenus, peuvent bénéficier régulièrement (tous les cinq ans) de bilans de santé complets, gratuits et sans avance de frais.',
        'simulator': '',
        'ask_text': 'Contactez votre caisse d\'Assurance Maladie',
        'checks': [
            {
                'function': is_in,
                'target': 'health_regime',
                'param': [
                    'cpam',
                    'msa'
                ]
            }
        ]
    },
    {
        'name': 'Aide médicale d\'État',
        'description': 'Dans le but de limiter l\'exclusion des personnes en situation irrégulière en France, l\'État a mis en place une aide disponible pour toute personne en situation irrégulière et pouvant justifier d\'au moins 3 mois de présence continue sur le territoire Français. Cette aide est soumise à des conditions de ressources.',
        'ask': 'http://www.ameli.fr/fileadmin/user_upload/formulaires/S3720.pdf',
        'checks': [
            {
                'function': is_equal,
                'target': 'nationality',
                'param': 'irreg'
            },
            {
                'function': function (val, param, user) {
                    var earned = user.wages + user.family_partner_wages + user.pole_wages;
                    var max = 0;
                    var people = 1 + user.family_childs;

                    if (user.family_status !== 'single')
                        people++;
                    if (people === 1)
                    {
                        max = 727;
                    }
                    else if (people === 2)
                    {
                        max = 1090;
                    }
                    else if (people === 3)
                    {
                        max = 1308;
                    }
                    else if (people === 4)
                    {
                        max = 1527;
                    }
                    else {
                        var new_count = people - 4;

                        max = 1527 + (new_count * 436.89);
                    }

                    if (user.home === "parents" || user.home === "free" || user.home === "own")
                    {
                        if (people === 1) {
                            max += 64.41;
                        } else if (people === 2) {
                            max += 112.72;
                        } else {
                            max += 135.27;
                        }
                    } else if (user.apl > 0) {
                        if (people === 1) {
                            max += 64.41;
                        } else if (people === 2) {
                            max += 128.83;
                        } else {
                            max += 128.83;
                        }
                    }

                    return earned < max;
                }
            },
            {
                'function': is_in,
                'target': 'country',
                'param': [
                    'metrop',
                    'dom'
                ]
            }
        ]
    },
    {
        'name': 'Pension de réversion',
        'description': 'La pension de réversion est une aide accordée aux personnes veuves de plus de 55 ans, qui leur permet de toucher une partie de la retraite qu\'aurais perçue leur ex-conjoint·e. Notez qu\'un remariage peut ne pas empêcher la pension de réversion.',
        'ask': "http://www.toutsurlaretraite.com/documents/formulaire_demande_retraite_reversion_S5136_cerfa.pdf",
        'checks': [
            {
                'function': is_greater,
                'target': 'age',
                'param': 55
            },
            {
                'function': is_equal,
                'target': 'widow',
                'param': 'yes'
            },
            {
                'function': function (_, param, user) {
                    var earned = user.wages + user.pole_wages;
                    var max = 20300.80;

                    if (user.family_status !== 'single')
                        max = 32481.28;

                    return earned < (max / 12);
                },
                'target': 'age',
                'param': ''
            }
        ]
    },
    {
        'name': 'Pension de veuvage',
        'description': 'La pension de veuvage est une pension qui peut être versée lorsqu\'une personne est veu·f·ve de son ou sa partenaire et a moins de 55 ans.',
        'ask': "https://www.formulaires.modernisation.gouv.fr/gf/cerfa_12098.do",
        'checks': [
            {
                'function': is_lower,
                'target': 'age',
                'param': 55
            },
            {
                'function': is_equal,
                'target': 'widow',
                'param': 'yes'
            },
            {
                'function': is_equal,
                'target': 'family_status',
                'param': 'single'
            },
            {
                'function': function (_, param, user) {
                    var earned = user.wages + user.pole_wages + user.rente + user.rsa + user.aah;
                    var max = 753.42;

                    return earned < max;
                },
                'target': 'age',
                'param': ''
            }
        ]
    },
    {
        'name': 'Garantie loca-pass',
        'description': 'La garantie Loca-Pass est un ensemble de deux éléments ; d\'une part, il s\'agit d\'un prêt à taux 0 pour couvrir en partie ou totalement la caution versée au bailleur lors de l\'entrée dans un logement, et ensuite, il s\'agit d\'un garant pour vous permettre de couvrir les éventuels loyers impayés.',
        'ask': 'http://www.actionlogement.fr/annuaire-cil',
        'checks': [
            {
                'function': is_in,
                'target': 'work',
                'param': [
                    'unemployed',
                    'willbe',
                    'part',
                    'full',
                    'formation',
                    'learn',
                    'intern'
                ]
            }
        ]
    },
    {
        'name': 'Musées gratuits',
        'description': 'Cette mesure vise à rendre la culture accessibles aux jeunes, dont la situation financière est souvent précaire. Il n\'y a pas de condition de ressources ou d\'études pour en bénéficier.',
        'ask_text': 'Contactez le musée qui vous intéresse pour vous renseigner',
        'checks': [
            {
                'function': is_lower,
                'target': 'age',
                'param': 26
            },
            {
                'function': is_greater,
                'target': 'age',
                'param': 18
            },
            {
                'function': is_in,
                'target': 'country',
                'param': [
                    'metrop',
                    'dom',
                    'eu'
                ]
            }
        ]
    },
    {
        'name': 'Billet congé SNCF',
        'description': 'Une fois par an, la SNCF vous donne droit à un billet aller-retour à prix réduits (réductions allant de -25% à -50%), pour un congé, avec certaines conditions sur le déplacements à réaliser. Ce billet peut inclure des accompagnants (en particuliers des éventuels enfants à charge)',
        'ask': 'https://www.aide-sociale.fr/wp-content/uploads/2017/02/demande-billet-annuel-44.pdf',
        'checks': [
            {
                'function': or,
                'target': 'age',
                'param': [
                    {
                        'function': is_in,
                        'target': 'work',
                        'param': [
                            'part',
                            'full',
                            'intern',
                            'learn',
                            'formation',
                            'entrepreneur'
                        ]
                    },
                    {
                        'function': is_greater,
                        'target': 'pole_wages',
                        'param': 1
                    }
                ]
            }
        ]
    },
    {
        'name': 'Cours de natation',
        'description': 'Pour les enfants âgées de 6 à 12 ans, des cours de natation gratuits sont proposés afin de diminuer les risques de noyade. Ces cours sont ouverts à tous les enfants, dans la limite des places disponibles.',
        'ask-text': 'Contactez la piscine la plus proche de chez vous',
        'checks': [
            {
                'function': is_greater,
                'target': 'family_childs',
                'param': 1
            }
        ]
    }
];

app.controller('index', [
    '$scope',
    function ($scope) {
        $scope.page = 'index';
        $scope.user = {};
        $scope.help = {};

        $scope.restart = function () {
            $scope.user = {
                'age': 18,
                'nationality': 'french',
                'country': 'metrop',
                'family_status': 'single',
                'family_partner_work': 'no',
                'family_childs': 0,
                'pregnant': 'no',
                'work': 'unemployed',
                'work_since': 0,
                'wages': 0,
                'apl': 0,
                'aah': 0,
                'rente': 0,
                'home': 'free',
                'rent_price': 0,
                'family_partner_wages': 0,
                'rsa': 0,
                'pole_wages': 0,
                'family_pension': 0,
                'pole': 'no',
                'health': 'valid',
                'nde': 'no',
                'invalidity': 0,
                'invalidity_child': 'none',
                'widow': 'no',
                'health_regime': 'cpam',
            };
            $scope.switchPage('start');
        };

        $scope.switchPage = function (page) {
            $scope.page = page;
        };

        $scope.calculate = function () {
            var possible = [];

            angular.forEach(helps, function (help) {
                var is_ok = true;

                console.log(help.name);
                angular.forEach(help.checks, function (check) {
                    var single_param = $scope.user[check.target];

                    is_ok = is_ok && check.function(single_param, check.param, $scope.user);
                });
                if (is_ok)
                    possible.push(help);
            });
            $scope.results = possible;
            $scope.switchPage('results');
        }
    }
]);