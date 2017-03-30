$().ready(init);
$("#btn-set-alarm").click(setAlarm);
$("#btn-alarm-back").click(backToMain);
$("#two").on("pagebeforeshow", showAlarmPage);
$("#main").on("pagebeforeshow", showMainPage);
$("#list-alarms").on("click", ".btn-alarm-del", removeAlarm);

var $timePicker;

//Действия при загрузке DOM
function init() {
	
	$timePicker = $("#timepicker");
	
	//Устанавливаем начальное время для picker'а
	var curTime = (new Date()).toTimeString().split(":");
	
	//console.log(curTime);
	
	$timePicker.val(curTime[0] + ":" + curTime[1]);
}

//Действия до появления страницы main
function showMainPage() {
	
	//Отображаем список напоминалок
	displayAlarmsList();
	
}
//Действия до появления страницы two
function showAlarmPage() {
	
	//Элемент <audio>
	var audioAlarm = $("#alarm-audio")[0];
	
	//Путь к файлу
	audioAlarm.src="/opt/usr/media/Music/Over the Horizon.mp3";
	
	//Запуск музыки
	audioAlarm.play();
}

//Функция отображения списка активных напоминалок
function displayAlarmsList() {

	var myAlarms = tizen.alarm.getAll();
	var htmlAlarmList = "<ul class='ui-listview'>";
	
	console.log(myAlarms);
	
	var i = 0;
	var l =	myAlarms.length;
	
	for(i; i < l; i++) {
		
		var strAlarmTime = myAlarms[i].date.toDateString() + " " + myAlarms[i].date.toTimeString().split(" ")[0];
							
		htmlAlarmList += "<li class='ui-li-static' style=' display: block; overflow: auto;'>" + strAlarmTime + 
						 	"<button style='float:right;' class='btn-alarm-del ui-btn ui-btn-circle icon-del' id='del_"+myAlarms[i].id+"'>" +
							"</button>" +
						 "</li>";
		console.log(myAlarms[i]);
		
	}
	
	htmlAlarmList += "</ul>";
	
	$("#list-alarms").html(htmlAlarmList);
}
//Возвращение на главную страницу после срабатывания напоминания
function backToMain() {
	
	var audioAlarm = $("#alarm-audio")[0];

	audioAlarm.pause();
	audioAlarm.currentTime = 0;
	
	tau.changePage('#main');
}
//Установка напоминания
function setAlarm() {

	var vTimeAlarm = new Date();
	
	var vTime = $timePicker.val();
	var arrHourMin = vTime.split(":");
	
	//console.log(vTime);
	//console.log(arrHourMin);
	
	//console.log(vTimeAlarm);
	
	if (arrHourMin.length === 2) {
		
		vTimeAlarm.setHours(arrHourMin[0], arrHourMin[1], 0);
		
		console.log(vTimeAlarm);
	}

	var myAlarm = new tizen.AlarmAbsolute(vTimeAlarm);
	
	var appControl = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/startMyAlarm", null, null, null, null);
	
	tizen.alarm.add(myAlarm, tizen.application.getAppInfo().id, appControl);
	
	displayAlarmsList();
	//console.log(tizen.alarm.getAll());
}
//Удаление напоминания
function removeAlarm() {
	
	var alarmId = this.id.split("_")[1];
	
	console.log(alarmId);
	
	tizen.alarm.remove(alarmId);
	
	displayAlarmsList();
	
}

