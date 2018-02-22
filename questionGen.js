

$( document ).ready(function() {
	var instructionArr;
	
	
	//console.log( "ready!" );
	
	questionGenTools.makeTextAreaTabWork("#instructArrTxt");
	
	
	$("#btnRun").on('click',function(){
		questionGenTools.writeStringFromTo('#instructArrTxt',instructionArr);
	});
	
	// to make textarea with numbered
	// jscript at js/jquery.numberedtextarea.js
	$('textarea').numberedtextarea();
	
	
	
	
});




