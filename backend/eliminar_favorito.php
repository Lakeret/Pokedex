
<?php

header("Content-Type: application/json; charset=utf-8");

require_once "conexion.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    echo json_encode([
        "error" => "Método no permitido."
    ]);

    exit;
}

$datos = json_decode(file_get_contents("php://input"), true);

$id = filter_var(
    $datos["pokemon_id"] ?? null,
    FILTER_VALIDATE_INT
);

if ($id === false || $id === null || $id <= 0) {

    http_response_code(400);

    echo json_encode([
        "error" => "El ID del Pokémon no es válido."
    ]);

    exit;
}

try {

    $consulta = $conexion->prepare(
        "DELETE FROM favoritos WHERE pokemon_id = :pokemon_id"
    );

    $consulta->execute([
        ":pokemon_id" => $id
    ]);

    if ($consulta->rowCount() === 0) {

        http_response_code(404);

        echo json_encode([
            "error" => "El Pokémon no está en favoritos."
        ]);

        exit;
    }

    echo json_encode([
        "mensaje" => "Pokémon eliminado de favoritos."
    ]);

} catch (PDOException $error) {

    http_response_code(500);

    echo json_encode([
        "error" => "No se pudo eliminar el Pokémon."
    ]);

}

?>
