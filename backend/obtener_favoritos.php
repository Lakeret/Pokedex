
<?php

header("Content-Type: application/json; charset=utf-8");

require_once "conexion.php";

try {

    $consulta = $conexion->prepare(
        "SELECT * FROM favoritos ORDER BY fecha_agregado DESC"
    );

    $consulta->execute();

    $favoritos = $consulta->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($favoritos);

} catch (PDOException $error) {

    http_response_code(500);

    echo json_encode([
        "error" => "No se pudieron obtener los favoritos."
    ]);

}

?>
