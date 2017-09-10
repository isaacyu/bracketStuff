// v3
// uploaded to github for jsfiddle use on 19/Jul/2017
// most updated file kept on google drive\jsApp2\Katex
// link for direct use:
// https://rawgit.com/isaacyu/bracketStuff/master/isaac.js
// link to make above link from github
// https://rawgit.com/
// github link
// https://github.com/isaacyu/bracketStuff/blob/master/isaac.js
var isaac ={
	// stringInsideDollar("abc","b") : false
	// stringInsideDollar("a$b$c","b") : true
	// stringInsideDollar("a$bc","b") : true
	// stringInsideDollar("a$b$c","c") : false
	
				
	isaacReplaceBefore: function(txt){
		//console.log("before replace, txt",txt);
		

		function handleUnderLineThenAnswer(){
		

			var count = 0;
			var underlineThneAns = isaac.extract(txt,"\\underline{\\Answer{");
			//console.log("underlineThneAns",underlineThneAns);
			
			// ****************************
			// there maybe more than one \Answer
			// ****************************
			while (underlineThneAns != "" && count < 100){
			
				var isAnsInsideDollar = isaac.stringInsideDollar(txt,underlineThneAns);
				//console.log("isAnsInsideDollar",isAnsInsideDollar);
			
				if (isAnsInsideDollar){
					txt = txt.replace(underlineThneAns,"\\underline{"+"~".repeat(underlineThneAns.length)+"}");
					
				}else{
				
					txt = txt.replace(underlineThneAns,"<u>"+"&nbsp".repeat(underlineThneAns.length)+"</u>");
				}
				//console.log("underlineThneAns",underlineThneAns,"underlineThneAns == ''", underlineThneAns=='',"txt",txt);
				//console.log("after replace:",txt);
				
				//console.log(isaac.stringInsideDollar("a$b$c","b")); //false
				// stringInsideDollar("a$b$c","b") : true
				// stringInsideDollar("a$bc","b") : true
				// stringInsideDollar("a$b$c","c") : false
				
				
				underlineThneAns = isaac.extract(txt,"\\underline{\\Answer{");
				//console.log("underlineThneAns",underlineThneAns);
				
				count++;
			}
		}		

		function handleAnswerWithoutUnderLine(){
		

			var count = 0;
			var ans = isaac.extract(txt,"\\Answer{");
			//console.log("ans",ans);
			
			// ****************************
			// there maybe more than one \Answer
			// ****************************
			while (ans != "" && count < 100){
			
				var isAnsInsideDollar = isaac.stringInsideDollar(txt,ans);
				console.log("isAnsInsideDollar",isAnsInsideDollar);
			
				if (isAnsInsideDollar){
					txt = txt.replace(ans,"");
					
				}else{
				
					txt = txt.replace(ans,"");
				}
				//console.log("underlineThneAns",underlineThneAns,"underlineThneAns == ''", underlineThneAns=='',"txt",txt);
				//console.log("after replace:",txt);
				
				//console.log(isaac.stringInsideDollar("a$b$c","b")); //false
				// stringInsideDollar("a$b$c","b") : true
				// stringInsideDollar("a$bc","b") : true
				// stringInsideDollar("a$b$c","c") : false
				
				
				ans = isaac.extract(txt,"\\Answer{");
				
				
				count++;
			}
		}		


		function replaceAllByExtract(wholeStr, startCommandStr, replaceByStr){
		
			var txt = wholeStr;
			var count = 0;
			var extract = isaac.extract(txt, startCommandStr);

			console.log("before txt", txt);
			
			// ****************************
			// there maybe more than one to replace
			// ****************************
			while (extract != "" && count < 100){
			
				
				txt = txt.replace(extract ,replaceByStr);
				extract = isaac.extract(txt, startCommandStr);

				console.log("processing txt", txt);				

				count++;
			}

			return txt;
		}		
		
		// ****************************
		// Some command in latex work well no matter it is inside $ $ or not, but it is not the case in Katex
		// those command should be inside $ $
		// this function first determine if a string is inside $ $, if it is inside $ $, replace it by newTruePartStr
		// otherwise, replace by newFalsePartStr
		// ****************************		
		function conditionalReplaceAll(wholeStr, oldPartStr, newTruePartStr, newFalsePartStr){
		
			var txt = wholeStr;
			var count = 0;
			var containOldPart = (isaac.mySearch(wholeStr, oldPartStr) != -1);
			
			
			while (containOldPart && count < 100){
			
				var isAnsInsideDollar = isaac.stringInsideDollar(wholeStr,oldPartStr);
				console.log("isAnsInsideDollar",isAnsInsideDollar);
			
				if (isAnsInsideDollar){
					txt = txt.replace(oldPartStr,newTruePartStr);
					
				}else{
				
					txt = txt.replace(oldPartStr,newFalsePartStr);
				}
				
				
				containOldPart = (isaac.mySearch(wholeStr, oldPartStr) != -1);
			
				
				count++;
			}

			return txt;
		}	

		
		// replace online comment
		txt = replaceByParentheses(txt, '%', '%', '\n', '<!--', '-->');	
		
		
		// ************************
		// replace \underline follow by \Answer with blank charAt
		// isaac.extract is a function that find the string enclosed by the given latex command
		// if there are more than one command, it will give the first result
		// ************************		
		handleUnderLineThenAnswer();
		
		handleAnswerWithoutUnderLine();
		
		// ************************		
		// all \begin{enumerate} will be covert to <ol>, all latex command concern list style are ignored
		// ************************		
		txt = txt.replace("\\renewcommand{\\theenumii}{\\Alph{enumii}}","");


		// ************************		
		// multic columns to nothing
		// ************************	
		txt = txt.replace("\\begin{multicols}{3}","");		
		txt = txt.replace("\\begin{multicols}{2}","");
		txt = txt.replace("\\end{multicols}","");
	

		// ************************		
		// tick box
		// ************************					
		txt = conditionalReplaceAll(txt, "\\AnsBoxCheck", "\\Box", "$\\Box$");
		txt = conditionalReplaceAll(txt, "\\AnsBox", "\\Box", "$\\Box$");
		txt = conditionalReplaceAll(txt, "\\checkmark", "\\zzzzzzzz", "$\\zzzzzzzz$");		
		txt = conditionalReplaceAll(txt, "\\zzzzzzzz", "\\checkmark", "$\\checkmark$");


		// ************************		
		// begin, end, itemize
		// ************************
		txt = txt.replace(/\\begin\{itemize\}([\s]+?)\\item/g,'<ul>$1<li>');
		txt = txt.replace(/\\end\{itemize\}/g,'</li></ul>')

		// ************************		
		// table
		// ************************
		function getBeforeContentAfterTable(txt){
			var tableHead = isaac.extract(txt,"\\begin{tabular}{");
			//console.log("tableHead",tableHead);
			//txt = replaceAllByExtract(txt, "\\begin{tabular}{", '<table style="width:100%"><tr>');
			//txt = txt.replace(/\\\\end\{tabular\}/g, '</tr></table>');
			var tableStart = txt.indexOf(tableHead);
			var tableEnd = txt.indexOf("\\end{tabular}");
			var tableContent, before, after;
			if (tableStart != -1 && tableEnd != -1){
				tableContent = txt.substring(tableStart, tableEnd +"\\end{tabular}".length);
				//console.log("table detected", tableContent);
				before = txt.substring(0,tableStart);
				after = txt.substring(tableEnd+"\\end{tabular}".length);

			}else{
				content = "";
				before = txt;
				after = "";

			}

			var tmp= {
				content: tableContent || "",
				before: before || "",
				after: after || ""				
			};
			

			//console.log("tmp",tmp);
			return tmp
		}

		//console.log("before txt",txt);
		
		var analysis = getBeforeContentAfterTable(txt);
		var before = analysis.before,
		tableContent = analysis.content,
		after = analysis.after;


		var tableHead = isaac.extract(tableContent,"\\begin{tabular}{");
		
		
		// ************************		
		// \hline in table, should be replaced before normal new line in latex table "\\"
		// ************************	
		//console.log("hline before content",tableContent);
		//tableContent = tableContent.replace(/\\\\\s\\hline/g, '</tr><tr><td colspan="3" style="height: 1px; padding: 0px; margin: 0px;border:none;border-bottom:1.5pt solid black;"></td></tr><tr>');
		tableContent = tableContent.replace(/\\hline/g, '</tr><tr><td colspan="3" style="height: 1px; padding: 0px; margin: 0px;border:none;border-bottom:1.5pt solid black;"></td></tr><tr>');
		//console.log("hline after content",tableContent);	
	
	


		
		// ************************		
		// latex table to html table
		// ************************			
		tableContent = tableContent.replace(tableHead, '<table><tr><td>');
		tableContent = tableContent.split("&").join('</td><td>');		
		tableContent = tableContent.split("\\\\").join('</td></tr><tr><td>');			
		tableContent = tableContent.replace("\\end{tabular}", '</td></tr></table>');		
		
		function handleVertForm(){
		
			//***********************************************
			

			// ************************		
			// some question are in vertical form use command \vertFormAnsBox
			// ************************	
			//var katexBox = "$ \\left\\lvert\\!\\rlap{\\rlap{\\qquad\\text{~~}}\\rule[-0.8ex]{1em}{0.1ex}}{\\rule[2ex]{1em}{0.1ex}}\\!\\right\\rvert $"
			
			// aim, to make a mulitple replace, by split and join
			
			// some ansBox not replaced due to new line, extra tab
			tableContent = tableContent.replace(/\n/g,"");
			tableContent = tableContent.replace(/\t/g,"");
			

			
			
			console.log("did tableContent contain any new line? index of new line ",tableContent.indexOf("\n"));
			console.log("did tableContent contain any tab? index of tab ",tableContent.indexOf("\t"));
			
			// restore 0, enable the for loop
			for(var i=0;i<10;i++){
				//tableContent = conditionalReplaceAll(tableContent, "\\vertFormAnsBox{"+i+"}", katexBox, "$"+katexBox+"$");
				//tableContent = tableContent.split("\\vertFormAnsBox{"+i+"} \\\\").join('<td style="border:1px solid;height:30px"></td></tr><tr>\n');
				//tableContent = tableContent.split("<td> \\vertFormAnsBox{"+i+"} </td>").join('<td style="border:1px solid;height:30px"></td></tr><tr>\n');
				
				// 
				
				// restore 1, by delete the next row
				//tableContent = txt;
				var myTmp = '<td style="border:1px solid;height:30px"></td>';
				//tableContent = tableContent.split("<td> \\vertFormAnsBox{"+i+"} </td>").join(myTmp);
				
				// here, try to fix problem by regexp
				tableContent = tableContent.replace(/<td>[\s\t]*\\vertFormAnsBox\{\d\}[\s\t]*<\/td>/g,myTmp);
				
				
				//console.log("tableContent",tableContent);
			}		

			var tmpIndexOf;
			

			
			
			for(var i=0;i<10;i++){

				tmpIndexOf = tableContent.indexOf("\\vertFormAnsBox{"+i+"}");
				console.log("tmpIndexOf","\\vertFormAnsBox{"+i+"}",tmpIndexOf);
				var tmpStr = tableContent.substring(tmpIndexOf);
				console.log("tmpStr, string after",tmpStr);		
				tmpStr = tableContent.substring(0,tmpIndexOf);
				console.log("tmpStr, string before",tmpStr);		
			
				var wholeStr = "<td> \\vertFormAnsBox{"+i+"} </td>";
				
				for(var j=0;j<wholeStr.length;j++){
					
					var growthStr = wholeStr.substring(0,j),
					growthStrBefore = wholeStr.substring(0,j-1),
					tmpIndexOf = tableContent.indexOf(growthStr),
					tmpIndexOfBefore = tableContent.indexOf(growthStrBefore);
					
					
					if (tmpIndexOf == -1 && tmpIndexOfBefore != -1){
					
						console.log("cannot find", growthStr, "but can find", growthStrBefore, "in string: ",tableContent);
					
					}
				
				}

			
			}			

			//**************************************************
		}
		
		//handleVertForm();
		//var myTmp = '<td style="border:1px solid;height:30px"></td>';		
		//tableContent = tableContent.replace(/<td>[\s\t\r]*\\vertFormAnsBox\{\d\}[\s\t\r]*<\/td>/g,myTmp);
			
		//restore 2, , by delete the next 2 rows
		txt = before + tableContent + after;
		//txt = tableContent;
		
		
		//console.log("after tableContent",tableContent);
		console.log("after txt",txt);		

		//console.log("after replace, txt",txt);		
		return txt;
	},

	
	isaacReplaceAfter: function (txt){

		// ************************		
		// in replaceAfter, all \begin{enumerate} have been replace by <ol>, we make the list A, B, C
		// ************************				
		txt = txt.replace("<ol>","<ol type='A'>");
		
		return txt;
	
	},

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
