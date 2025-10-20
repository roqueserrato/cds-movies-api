Levantar API
npm run dev

Revisar estado
curl http://localhost:3000/health

Registro de usuario
curl -X POST http://localhost:3000/auth/register \
 -H "Content-Type: application/json" \
 -d '{ "email":"",
"firstName":"",
"lastName":"",
"password":""
}'

Iniciar sesión (y guardar el token en memoria para operaciones)
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
 -H "Content-Type: application/json" \
 -d '{ "email":"",
"password":""}' | jq -r .token)
echo $TOKEN

Ver sugerencias
curl http://localhost:3000/movies/suggestions \
 -H "Authorization: Bearer $TOKEN"

Busqueda por texto
TOKEN="tu_token_jwt"
curl "http://localhost:3000/movies/suggestions?keyword= " \
 -H "Authorization: Bearer $TOKEN"

listar favoritos y datos
curl http://localhost:3000/favorites \
 -H "Authorization: Bearer $TOKEN"

Agregar a favoritos (requiere token de usuario)
curl -X POST http://localhost:3000/favorites \
 -H "Authorization: Bearer $TOKEN" \
 -H "Content-Type: application/json" \
 -d '{"movieId":
}'
