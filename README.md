# project-code-pdf
Configura el proyecto con un frontend en React y un backend en Node.js que se conecte a MongoDB. Asegúrate de que tienes instalado Node.js, MongoDB, y una biblioteca para manejar archivos PDF como pdf-lib.
Organiza el proyecto con las siguientes carpetas y archivos:

bash
Copiar código
/project-root
│
├── /backend
│   ├── /models
│   │   └── PdfFile.js
│   ├── /routes
│   │   └── pdf.js
│   ├── /controllers
│   │   └── pdfController.js
│   ├── server.js
│   └── package.json
│
├── /frontend
│   ├── /src
│   │   ├── /components
│   │   │   └── UploadFile.js
│   │   ├── /services
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── docker-compose.yml
└── README.md
