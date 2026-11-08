# Draft Battle

Juego de draft 1 contra 1 con subasta de personajes (One Piece, Naruto, Dragon Ball, Star Wars y Pokémon).

Web/app: https://alvarolacalamita-creator.github.io/draft-battle/

## Prueba de ChatGPT (reversible)

El botón "Valorar con ChatGPT" de la pantalla de resultados es una prueba. Todos los commits de esa prueba
llevan la palabra clave `chatgpt-prueba` en su mensaje, y no tocan nada más (el cálculo automático de Pokémon
va en un commit aparte).

Para quitarla y dejar la app como estaba antes:

```bash
git revert --no-edit $(git log --format=%h --grep=chatgpt-prueba main) && git push origin main
```
