
<?php

header("Content-Type: application/json; charset=utf-8");

require_once "conexion.php";

// Solo aceptamos solicitudes POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    echo json_encode([
        "error" => "Método no permitido."
    ]);

    exit;
}

// Recibimos los datos enviados desde JavaScript
$datos = json_decode(file_get_contents("php://input"), true);

// Validamos los datos recibidos
if (
    !is_array($datos) ||
    !isset($datos["pokemon_id"], $datos["pokemon_name"], $datos["pokemon_image"])
) {

    http_response_code(400);

    echo json_encode([
        "error" => "Faltan datos del Pokémon."
    ]);

    exit;
}

$pokemonId = filter_var($datos["pokemon_id"], FILTER_VALIDATE_INT);
$pokemonName = trim($datos["pokemon_name"]);
$pokemonImage = trim($datos["pokemon_image"]);

// Comprobamos que los datos sean válidos
if (
    $pokemonId === false ||
    $pokemonId <= 0 ||
    $pokemonName === "" ||
    strlen($pokemonName) > 100 ||
    filter_var($pokemonImage, FILTER_VALIDATE_URL) === false
) {

    http_response_code(400);

    echo json_encode([
        "error" => "Los datos del Pokémon no son válidos."
    ]);

    exit;
}

try {

    $consulta = $conexion->prepare(
        "INSERT INTO favoritos (pokemon_id, pokemon_name, pokemon_image)
         VALUES (:pokemon_id, :pokemon_name, :pokemon_image)"
    );

    $consulta->execute([
        ":pokemon_id" => $pokemonId,
        ":pokemon_name" => $pokemonName,
        ":pokemon_image" => $pokemonImage
    ]);

    echo json_encode([
        "mensaje" => "Pokémon agregado a favoritos.",
        "id" => $conexion->lastInsertId()
    ]);

} catch (PDOException $error) {

    if ($error->getCode() === "23000") {

        http_response_code(409);

        echo json_encode([
            "error" => "Este Pokémon ya está en favoritos."
        ]);

    } else {

        http_response_code(500);

        echo json_encode([
            "error" => "No se pudo agregar el Pokémon."
        ]);

    }

}

?>
