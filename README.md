# Draft Battle

Juego de draft 1 contra 1 con subasta de personajes (One Piece, Naruto, Dragon Ball, Star Wars y Pokémon).

Web/app: https://alvarolacalamita-creator.github.io/draft-battle/

## Prueba de ChatGPT (reversible)

El botón "Valorar con ChatGPT" de la pantalla de resultados es una prueba. Todo ese cambio está en un único
commit marcado con la etiqueta `chatgpt-prueba`; el estado justo anterior está marcado como `antes-de-chatgpt`.

Para quitarlo sin tocar nada más (incluido el cálculo automático de Pokémon):

```bash
git revert --no-edit chatgpt-prueba && git push origin main
```
