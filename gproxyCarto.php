<?
$id=$_GET['id'];
$gid=$_GET['gid'];
$cache_life = '120'; //caching time, in seconds

$file = "data/${id}_${gid}.txt";
if (file_exists($file)){
	if (time()-filemtime ($file) >=$cache_life)
	{
		$contents = file_get_contents("https://docs.google.com/spreadsheets/d/2PACX-1vS5reLPK6XbxdRbrxKEgvM2a-aBRKh8qbVt9ej4HEv_Orw59ICfRThDCIoO7SZdFLTPZA1j1jlE4U7O/pub?output=csv&gid=0");
		file_put_contents($file,$contents);
	}
	else{
		$contents = file_get_contents($file);
	} 

}
else {
	$contents = file_get_contents("https://docs.google.com/spreadsheets/d/2PACX-1vS5reLPK6XbxdRbrxKEgvM2a-aBRKh8qbVt9ej4HEv_Orw59ICfRThDCIoO7SZdFLTPZA1j1jlE4U7O/pub?output=csv&gid=0");
	file_put_contents($file,$contents);
}


print $contents;

?>
