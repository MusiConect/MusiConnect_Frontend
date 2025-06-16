# Musiconnect Front-end

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 19.2.15.

Para los estilos (CSS) del proyecto, se está usando TailWind CSS en su version 3.4.3

Si no tienes TailWind CSS instalado o si tienes la version 4.0 o superior, ejecuta este comando dentro de la carpeta del proyecto para instalar TailWind:

```bash
npm install tailwindcss@3.4.3 postcss autoprefixer
```

## IMPORTANTE: Antes de correr el proyecto angular

Es posible que cuando quieras correr el proyecto te salga un mensaje mencionando que los packages de Node no están instalados, en ese caso dentro de la carpeta del proyecto pongan este comando, debería solucionarlo:

```bash
npm install
```

## Servidor de desarrollo

Para iniciar un servidor de desarrollo local, ejecuta:

```bash
ng serve
```

Una vez que el servidor esté en funcionamiento, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cada vez que modifiques alguno de los archivos fuente.

## Andamiaje de código (Code scaffolding)

Angular CLI incluye potentes herramientas de andamiaje de código. Para generar un nuevo componente, ejecuta:

```bash
ng generate component nombre-del-componente
```

Para obtener una lista completa de los esquemas (schematics) disponibles (como `components`, `directives` o `pipes`), ejecuta:

```bash
ng generate --help
```

## Compilación (Building)

Para compilar el proyecto, ejecuta:

```bash
ng build
```

Esto compilará tu proyecto y almacenará los artefactos de compilación en el directorio `dist/`. Por defecto, la compilación de producción optimiza tu aplicación para obtener el mejor rendimiento y velocidad.

## Ejecución de pruebas unitarias

Para ejecutar las pruebas unitarias con el ejecutor de pruebas [Karma](https://karma-runner.github.io), utiliza el siguiente comando:

```bash
ng test
```

## Ejecución de pruebas de extremo a extremo (end-to-end)

Para las pruebas de extremo a extremo (e2e), ejecuta:

```bash
ng e2e
```

Angular CLI no viene con un framework de pruebas de extremo a extremo por defecto. Puedes elegir el que mejor se adapte a tus necesidades.
