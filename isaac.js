// uploaded to github for jsfiddle use on 19/Jul/2017
// most updated file kept on google drive\jsApp2\Katex
var isaac ={
	// stringInsideDollar("abc","b") : false
	// stringInsideDollar("a$b$c","b") : true
	// stringInsideDollar("a$bc","b") : true
	// stringInsideDollar("a$b$c","c") : false
	stringInsideDollar: function(wholeStr, partStr){
		
		var posOfPart = isaac.mySearch(wholeStr,partStr);
		
		if (posOfPart == -1){
			
			return false;
			
		}else{
			
			var countDollar = 0;
			
			for (var i=0;i<posOfPart;i++){
				
				//console.log('wholeStr[i]',wholeStr[i]);
				
				if (wholeStr[i] === "$"){
					
					countDollar++;
					
				}
				
			}
			
			var result = ((countDollar % 2) == 0)? false:true;
			
			return result;
			
		}
		
	},
	// need to test "a\bc", "\b" 
	mySearch: function (fromStr,strToSearch) {

		for(var i=0;i<fromStr.length-strToSearch.length+1;i++){
			//var i = 0;
			var thisPart = fromStr.substring(i,i+strToSearch.length);
			//console.log("i",i,"thisPart",thisPart);
			if (thisPart == strToSearch){
				return i;
			}
		}
		return -1;


		//return 3;
	},
	
	// function("before\\abc{def}after","\\abc{") gives "\\abc{def}"
	extract: function(contentStr,commandStr){
	
		var mySearch = this.mySearch;
		
		function survayString(contentStr,singleStartStr,singleEndStr) {
			var tmp = [],levelArr = [];
			var level = 0;

			for (var i=0;i<contentStr.length;i++){

				//var thisLevel

				if(contentStr[i] == singleStartStr){
				  level = level +1;
				}
				if(contentStr[i] == singleEndStr){
				  level = level -1;
				}  

				tmp.push({
				  index:i,					
				  string:contentStr[i],
				  level:level,
				});

				levelArr.push(level);

			}
			  
			//alert(tmp);

			return tmp;//JSON.stringify(tmp);//tmp.length;
			//tmp;
		  
		}

		// assume bracket pairs are {}
		function getPosOfClosedBracket(contentStr,commandStr){

			function actionIfContentContainCommand(){
				

			
				// ************************************************************				
				// example: 
				// for ""adkfjoie\\Question{\\chinese{計算：}}abcd"
				// "\Question" has level zero
				// "{\\chinese{計算：}}" has level 1+
				// ************************************************************	
				var startLevel = stat[containCommandAt].level;
				//console.log("startLevel",startLevel);
				

				var startSearchPos = containCommandAt + commandStr.length;
				//console.log("startSearchPos",startSearchPos,"string before: ",contentStr.substring(0,startSearchPos-1));
				

				// ************************************************************
				// if the bracket happen in the middle, if the start level is 0, its position is string just before level return zero
				// typical level sequence will be 000001121232221000
				// if not, it should be at the end.
				// if bracket in the middle, endPos will be set. Otherwise, endPos = -1
				// ************************************************************
				for (var i=startSearchPos;i<stat.length-1;i++){

					var thisCharIsStartLevel = stat[i].level==startLevel;
					//console.log("thisCharIsLevelPlusOne",thisCharIsLevelPlusOne);

					
					if(stat[i-1].level==startLevel+1 && thisCharIsStartLevel){
					  endPos=i;
					  break;
					}

				}

				//console.log("endPos",endPos);

				// now, endPos = -1, either the string is ill formed or the bracket is at the end
				if (endPos==-1){
					var levelCorrect = stat[contentStr.length-1].level == startLevel;

					var lastCharIsCorrect = contentStr[contentStr.length-1] == "}";

					if (levelCorrect && lastCharIsCorrect){
					  
						endPos = contentStr.length-1;

						return endPos;
					  
					}
					/*   
					if (levelCorrect && (!lastCharIsCorrect)){
					  
					  //console.log("too many {");
					  
					}
					*/  
				}
				
			}
		  
			//console.log("contentStr", contentStr, "commandStr", commandStr);

			var stat = survayString(contentStr,"{","}");
			//console.log("stat",JSON.stringify(stat).split(",").join("\n"));

			var containCommandAt = mySearch(contentStr,commandStr);
			//contentStr.search(commandStr);
			//console.log("containCommandAt",containCommandAt);

			
			var endPos=-1;

			var isContentContainCommand = (containCommandAt != -1);
			
			if (isContentContainCommand){
			
				actionIfContentContainCommand();	
				
			}

			


			return endPos;
			//return containCommandAt;
			//return stat.length;
		  
		}

		var end = getPosOfClosedBracket(contentStr,commandStr);

		//onsole.log("end",end);

		var start = mySearch(contentStr,commandStr);

		var tmp = contentStr.substring(start,end+1);

		return tmp;

	},


}
