# Goal Manager App

Aplicación React Native para administrar objetivos personales con etapas y tareas.

## Características

- Crear objetivos con estructura jerárquica (Objetivos > Etapas > Tareas)
- Barra de progreso para cada objetivo y etapa
- Subir evidencia para completar tareas
- Notificaciones configurables
- Base de datos local SQLite
- Importar objetivos desde JSON generado por LLM

## Instalación

1. Clona el repositorio
2. `npm install`
3. `npm start` para Expo

## Uso

- Pantalla principal: Lista de objetivos
- Crear objetivo: Pega JSON de LLM o crea manualmente
- Detalle de objetivo: Ver etapas
- Detalle de etapa: Ver tareas y subir evidencia

## Formato JSON para LLM

```json
{
  "title": "Aprender React Native",
  "description": "Dominar el desarrollo móvil con React Native",
  "stages": [
    {
      "title": "Fundamentos",
      "description": "Aprender basics",
      "tasks": [
        {
          "title": "Instalar Node.js",
          "description": "Instalar Node.js y npm"
        }
      ]
    }
  ]
}
```

## Futuras mejoras

- Autenticación de usuarios
- Sincronización en la nube
- Más tipos de evidencia