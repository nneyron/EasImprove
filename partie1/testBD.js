ajaxGet("https://easimprove.herokuapp.com/api.php/verbes", function (reponse) 
{
    // Transforme la réponse en tableau d'objets JavaScript
    var verbes = JSON.parse(reponse);
    // Affiche le titre de chaque film
    /*verbes.records.forEach(function (verbe) 
    {
        console.log(verbe["verbe"]);
    });*/
    //console.log(verbes["records"]["0"]["1"]);
    //console.log(verbes["columns"][4]);
    //console.log(verbes.columns[0]);
    //console.log(verbes["columns"].length);
    console.log(verbes);
    console.log(verbes.valueOf(['columns'][0]));
    console.log(verbes['columns']);
    console.log(verbes.columns);
    var toto = {squirrel:false,
    envents:["11","22","33"]};
    console.log(toto.envents[0]);
});
