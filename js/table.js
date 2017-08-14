window.onload=function(){
	var oTab=document.getElementById("tab");
    var tHead=oTab.tHead;
    var oTh=tHead.rows[0].cells;
    var tBody=oTab.tBodies[0];
    var oRows=tBody.rows;
    var data=null;

/*1.首先先获取后台data.txt中的数据，json格式的字符串
 * 1）ajax
 * （1）首先创建一个ajax对象
 * （2）打开需要请求的那个地址
 * （3）监听请求的状态
 * （4）发送
  
  */
var xhr=new XMLHttpRequest;
xhr.open("get","data.txt",false);
xhr.onreadystatechange=function(){
	if(xhr.readyState===4&&(xhr.status>=200&&xhr.status<=300)){
		var val=xhr.responseText;
		data=JSON.parse(val);
		//console.log(data);
	}
};
xhr.send(null);

//2.实现数据绑定 -》文档碎片
//创建一个文档碎片
function bind(){
	var frg=document.createDocumentFragment();
for(var i=0,l=data.length;i<l;i++){
	var cur=data[i];
	var oTr=document.createElement("tr");//每一次循环创建一个tr
	//每一个tr中还需要创建四个td
	for(var key in cur){
		var oTd=document.createElement("td");
		if(key==="sex"){
		oTd.innerHTML=(cur[key]==0?"男":"女");
		}else{
			oTd.innerHTML=cur[key];
		}
		
		oTr.appendChild(oTd);
	}
	frg.appendChild(oTr);
}
tBody.appendChild(frg);
frg=null;
}
bind();
function changeBg(){
	for(var i=0,l=oRows.length;i<l;i++){
		oRows[i].className=i%2==1?"bg":null;
	}
	
}
changeBg();


//3.表格排序，实现按照年龄这一列进行排序
function mySort(n){
	//把存储所有行的类数组转化为数组
	var newArr=Array.prototype.slice.call(oRows);
	//给数组进行排序,按照每一行的第二列的数据进行排序
	var that=this;
	//点击其他列，需要将其他列的flag变成初始值
	for(var k=0,l=oTh.length;k<l;k++){
		if(oTh[k]!=this){
			oTh[k].flag=-1;
		}
	}
	that.flag*=-1;
	newArr.sort(function(a,b){
		//this ->window
		return parseFloat(a.cells[n].innerHTML)-parseFloat(b.cells[n].innerHTML)*that.flag;
	});
	var frg=document.createDocumentFragment();
	for(var i=0,l=newArr.length;i<l;i++){
		frg.appendChild(newArr[i]);	
	}
	tBody.appendChild(frg);
	frg=null;
	//按照最新的顺序重新进行隔行变色
	changeBg();
}
for (var i=0,l=oTh.length;i<l;i++) {
	var curTh=oTh[i];
	if(curTh.className=="cursor"){
		curTh.index=i;//用来存储索引
	    curTh.flag=-1;//用来实现升降序
		curTh.onclick=function(){
			mySort.call(this,this.index);
		}
	}
}


};