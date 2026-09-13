# amor.ao — Landing Page

Landing page simples e responsiva para a amor.ao.

## Personalizar os dois sites

Abra `script.js` e altere:

```js
const projects = [
  { name: "Nome do primeiro site", url: "https://..." },
  { name: "Nome do segundo site", url: "https://..." }
];
```

## Contactos

No `index.html`, substitua:
- `contacto@amor.ao`
- `+244 900 000 000`

pelos contactos reais.

## Nota sobre iframes

Alguns sites bloqueiam a incorporação por iframe através de `X-Frame-Options` ou `Content-Security-Policy`.
Se isso acontecer, o botão **Abrir ↗** continua a permitir abrir o site directamente.
