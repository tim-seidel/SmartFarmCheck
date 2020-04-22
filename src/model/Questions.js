const questions = [
    {
        "uuid": "1a3fb5f0-5960-47b9-a35a-222d99d3a8bc",
        "text": "Wie viele Bewirtschaftungsmaßnahmen führen Sie im Durchschnitt bei Ihren Hauptkulturen durch?",
        "description": null,
        "version": 0,
        "validator": {
            "uuid": "dd54f0a1-dc7f-4c19-9718-4384a7a9cf71",
            "inputType": "NUMBER",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 1,
            "max": 20,
            "options": [],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 1
    },
    {
        "uuid": "62ca954c-b414-4144-8e06-248d1b935ca4",
        "text": "Wie viele Kulturen bauen Sie in Ihrem Betrieb an?",
        "description": null,
        "version": 0,
        "validator": {
            "uuid": "44faaa03-5ec3-4fb1-a7a8-04c264851a51",
            "inputType": "NUMBER",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 1,
            "max": 10,
            "options": [],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 1
    },
    {
        "uuid": "6706f7e0-ab5f-47b6-acff-298fccf3632f",
        "text": "Wie groß sind Ihre Felder durchschnittlich?",
        "description": null,
        "version": 0,
        "validator": {
            "uuid": "53907fa0-2722-4d88-b5ae-65d225a4c227",
            "inputType": "NUMBER",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 0,
            "max": 250,
            "options": [],
            "repeatable": false,
            "unit": "ha"
        },
        "formPriority": 1
    },
    {
        "uuid": "fd0cfb2c-4596-4617-862a-4dd6539fb458",
        "text": "Wie viele Felder bewirtschaftet Ihr Betrieb?",
        "description": null,
        "version": 0,
        "validator": {
            "uuid": "8123b905-0c05-439c-a46a-7bdb750c6ff8",
            "inputType": "NUMBER",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 1,
            "max": 100,
            "options": [],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 1
    },
    {
        "uuid": "49883e6f-c23d-483d-ac56-6f004b9da921",
        "text": "Nutzen sie bereits digitale Programme im Betrieb?",
        "description": "Hierzu gehören z.B. Herdenmanagementprogramme, digitale Ackerschlagkartei etc.",
        "version": 1,
        "validator": {
            "uuid": "90f4d2b7-e51d-4835-9e5c-b90973f28502",
            "inputType": "SELECT",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 0,
            "max": 0,
            "options": [
                "Ja",
                "Nein"
            ],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 2
    },
    {
        "uuid": "7127b9ba-6abe-42e9-ad58-e99a5e384e2a",
        "text": "Wie viele Betriebszweige/Standbeine umfasst Ihr Betrieb?",
        "description": "Unter Betriebszweig werden Bereiche wie z.B. Biogas, Ackerbau, Schweinemast, Milchvieh etc. verstanden.",
        "version": 1,
        "validator": {
            "uuid": "fbe62239-942c-4d50-9ec3-94b2c73adbac",
            "inputType": "NUMBER",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 0,
            "max": 10,
            "options": [],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 2
    },
    {
        "uuid": "7cb160d1-6fd7-4531-90e4-0d1210f84c3d",
        "text": "Wie viel Gesamtfläche bewirtschaftet Ihr Betrieb?",
        "description": null,
        "version": 0,
        "validator": {
            "uuid": "2c1d0f5b-8ff5-4420-8d8d-a3e52969f58e",
            "inputType": "NUMBER",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 0,
            "max": 10000,
            "options": [],
            "repeatable": false,
            "unit": "ha"
        },
        "formPriority": 2
    },
    {
        "uuid": "fae4b11e-54ad-4446-b329-d61fd229597e",
        "text": "Beschäftigen Sie Mitarbeiter?",
        "description": null,
        "version": 0,
        "validator": {
            "uuid": "b125fe1e-283d-43c0-bef0-189d522d3319",
            "inputType": "SELECT",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 0,
            "max": 0,
            "options": [
                "Ja",
                "Nein"
            ],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 3
    },
    {
        "uuid": "616d29c9-56c3-4a93-b883-509d67de113b",
        "text": "Erledigen Sie viele Arbeiten in Eigenmechanisierung?",
        "description": null,
        "version": 0,
        "validator": {
            "uuid": "51bd4c0d-75ba-4698-8b7a-14dc3954099f",
            "inputType": "SELECT",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 0,
            "max": 0,
            "options": [
                "Ja",
                "Nein"
            ],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 4
    },
    {
        "uuid": "22dbdef6-6937-4507-9f88-bbe3f9169d26",
        "text": "Wie häufig befahren Sie Ihre Felder bei den Hauptkulturen? ",
        "description": "Hierbei werden alle Überfahrten / Arbeitsschritte verstanden, die für die Hauptkulturen nötig sind. ",
        "version": 1,
        "validator": {
            "uuid": "42f26f0a-a107-485b-b527-97ffa2f5caea",
            "inputType": "NUMBER",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 1,
            "max": 20,
            "options": [],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 5
    },
    {
        "uuid": "96821c74-9823-4e70-b067-4ae6df7a2ca5",
        "text": "Welche Arbeitsbreiten nutzen Sie bei der Bodenbearbeitung und Aussaat?",
        "description": null,
        "version": 0,
        "validator": {
            "uuid": "53fd876f-27e9-444a-929a-bb597cd19eff",
            "inputType": "NUMBER",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 3,
            "max": 12,
            "options": [],
            "repeatable": false,
            "unit": "m"
        },
        "formPriority": 5
    },
    {
        "uuid": "55a463fd-fc43-4fc4-9e44-f0f2b9173043",
        "text": "Nutzen Sie bei der Bodenbearbeitung und Aussaat Orientierungshilfen, wie z.B. Spuranreißer?",
        "description": null,
        "version": 1,
        "validator": {
            "uuid": "02965566-a044-47be-ba0d-771eb75bbdf0",
            "inputType": "SELECT",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 0,
            "max": 0,
            "options": [
                "Ja",
                "Nein"
            ],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 6
    },
    {
        "uuid": "d66f02b5-be5d-491b-a0f7-b57a434e4469",
        "text": "Welche Arbeitsbreiten nutzen Sie bei der Düngung und dem Pflanzenschutz?",
        "description": null,
        "version": 0,
        "validator": {
            "uuid": "52b0035e-acd0-45ac-bdd1-0749f7fbbc9e",
            "inputType": "NUMBER",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 3,
            "max": 36,
            "options": [],
            "repeatable": false,
            "unit": "m"
        },
        "formPriority": 7
    },
    {
        "uuid": "248c3c8f-443e-4a0b-96d8-3fbba5b2f329",
        "text": "Nutzen Sie bei der Düngung und dem Pflanzenschutz Orientierungshilfen z.B. Fahrgassen?",
        "description": null,
        "version": 1,
        "validator": {
            "uuid": "33341666-23f7-4bc7-98a3-d1fdd4f44588",
            "inputType": "SELECT",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 0,
            "max": 0,
            "options": [
                "Ja",
                "Nein"
            ],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 8
    },
    {
        "uuid": "9e9c07e5-1f7e-453b-8075-60d54b41618d",
        "text": "Erledigen Sie in Eigenmechanisierung viele Arbeiten mit mehrmaligen Überfahrten z.B. Pflanzenschutz?",
        "description": null,
        "version": 0,
        "validator": {
            "uuid": "b7dd5e3f-9dfc-4391-aca5-524faef78261",
            "inputType": "SELECT",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 0,
            "max": 0,
            "options": [
                "Ja",
                "Nein"
            ],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 8
    },
    {
        "uuid": "54ec8bac-9efd-4413-af1e-60d99bde9fa4",
        "text": "Führen Sie Arbeiten als Dienstleistung durch?",
        "description": null,
        "version": 1,
        "validator": {
            "uuid": "f523f808-2538-45bb-aa69-5d18be28e2f7",
            "inputType": "SELECT",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 0,
            "max": 0,
            "options": [
                "Ja",
                "Nein"
            ],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 9
    },
    {
        "uuid": "351fc4ed-8c80-471e-9f35-002f26b53c1a",
        "text": "Möchten Sie bei Ihren Fahrspuren eine Wiederholbarkeit haben?",
        "description": "z.B. für dauerhafte Fahrspuren beim Einsatz von Controlled Traffic (CTF)",
        "version": 2,
        "validator": {
            "uuid": "74c9cad3-1df1-438d-83c8-2532e1b5fd15",
            "inputType": "SELECT",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 0,
            "max": 0,
            "options": [
                "Ja",
                "Nein"
            ],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 10
    },
    {
        "uuid": "121c8a26-9fa7-4a5b-87ea-e239699b0268",
        "text": "Erledigen Sie Arbeiten wie Aussaat, mech. Unkrautbekämpfung?",
        "description": null,
        "version": 0,
        "validator": {
            "uuid": "3aa7cc3d-03b6-4503-b11a-e6d32491ae3e",
            "inputType": "SELECT",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 0,
            "max": 0,
            "options": [
                "Ja",
                "Nein"
            ],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 11
    },
    {
        "uuid": "eeda2908-fb38-4093-8407-669a1f724f4f",
        "text": "Ist Ihre Feldgeometrie überwiegend rechtwinkelig?",
        "description": null,
        "version": 0,
        "validator": {
            "uuid": "1f57fa68-38a8-4ed0-bd81-cff49553b692",
            "inputType": "SELECT",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 0,
            "max": 0,
            "options": [
                "Ja",
                "Nein"
            ],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 12
    },
    {
        "uuid": "b56f05e1-3188-4fe3-a9e1-cbe4bf503c95",
        "text": "Pflegen Sie die Buchführung alleine?",
        "description": null,
        "version": 0,
        "validator": {
            "uuid": "fc9e6396-b4d9-4c1f-9d9f-76e0370295f4",
            "inputType": "SELECT",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 0,
            "max": 0,
            "options": [
                "Ja",
                "Nein"
            ],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 13
    },
    {
        "uuid": "31b9b23b-557b-467f-8791-802053d75e78",
        "text": "Haben Sie viele Nachweispflichten und/oder Kontrollen?",
        "description": null,
        "version": 0,
        "validator": {
            "uuid": "0dfd62f5-3576-46aa-b98f-f9b855a3c28e",
            "inputType": "SELECT",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 0,
            "max": 0,
            "options": [
                "Ja",
                "Nein"
            ],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 14
    },
    {
        "uuid": "fa6ac5f8-ef02-4067-a763-05f5967333ba",
        "text": "Bekommen Sie Ihre Rechnungen überwiegend online?",
        "description": null,
        "version": 0,
        "validator": {
            "uuid": "46511517-39dd-4364-be9a-1a1252b9798f",
            "inputType": "SELECT",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 0,
            "max": 0,
            "options": [
                "Ja",
                "Nein"
            ],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 15
    },
    {
        "uuid": "7e6476f7-ed9f-48ab-b6d9-fca7f4ee2bd7",
        "text": "Wie viele Ein- und Ausgangsrechnungen fallen im Durchschnitt pro Woche an?",
        "description": null,
        "version": 0,
        "validator": {
            "uuid": "a1cd1658-3597-448a-9070-c1f7b5548ff3",
            "inputType": "NUMBER",
            "pattern": null,
            "minLength": 0,
            "maxLength": 0,
            "min": 1,
            "max": 50,
            "options": [],
            "repeatable": false,
            "unit": null
        },
        "formPriority": 16
    }
]

export default questions;