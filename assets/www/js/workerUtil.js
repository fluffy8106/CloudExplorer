function startSearchWorkers()
{
	var jsonStr = {"price":"0","recordNo":"1428511160000001E31011520140717604111","description":"包括胸部(含肺、胸腔 、纵隔)、腹部( 含肝 、 胆 、 胰 、 脾 、 双肾)、胃肠道、泌尿系(含双肾、输尿管、膀胱、前列腺)、妇科(含子宫、附件、膀胱及周围组织)、产科(含胎儿及宫腔)","provider":"","properties":[{"value":"B-routine examination","displayName":"英文名称"},{"value":"胸部(含肺、胸腔 、纵隔)、腹部( 含肝 、 胆 、 胰 、 脾 、 双肾)、胃肠道、泌尿系(含双肾、输尿管、膀胱、前列腺)、妇科(含子宫、附件、膀胱及周围组织)、产科(含胎儿及宫腔)","displayName":"检查部位"},{"value":"B超","displayName":"检查器械"},{"value":"无","displayName":"备注"},{"value":0,"displayName":"产品地区来源"}],"recordTime":{"nanos":0,"time":1405736867000,"minutes":27,"seconds":47,"hours":10,"month":6,"timezoneOffset":-480,"year":114,"day":6,"date":19},"productName":"B超常规检查","companyDesc":"在线医疗中心","itemServices":"","picLink":"484_images_1.gif;","productType":484},{"price":"0","recordNo":"1421111150000001E31011520140724410411","description":"耳纤维内镜检查","provider":"","properties":[{"value":"english","displayName":"英文名称"},{"value":"耳纤维内镜检查","displayName":"检查部位"},{"value":"耳纤维内镜检查","displayName":"检查器械"},{"value":"无","displayName":"备注"},{"value":0,"displayName":"产品地区来源"}],"recordTime":{"nanos":0,"time":1406542261000,"minutes":11,"seconds":1,"hours":18,"month":6,"timezoneOffset":-480,"year":114,"day":1,"date":28},"productName":"耳纤维内镜检查","companyDesc":"彩云医疗有限公司","itemServices":"","picLink":"534_images_1.gif;","productType":484};
	alert(jsonStr);
}

//部分代码冗余，但为了区分不同应用，没有消除
function getTailorInstanceSuccess(message)
{
	var jsonObject = eval("(" + message + ")");
	getInstancePublicPart(jsonObject);
}
function callSubmitOrderForBuyer(username, password, recordNos, instanceIds, dates, quantities)
{
	showLoadingDiv("正在为您下单");
	cordova.exec(callSubmitOrderForBuyerSuccess, callWebServiceError, 'TailorService', 'submitOrder',[username, password, 
	recordNos, instanceIds, dates, quantities]);
}
	
function callSubmitOrderForBuyerSuccess(message)
{
	hideLoadingDiv();
	if(parseInt(message) > 0)
	{
		Toast("恭喜您下单成功！", 2000);
		window.localStorage.buyList = "";
		$("#payOk_div_demo").css("display", "");
		$("#page_pay_okay").find(".container").html($("#payOk_div_demo").html());
		$("#page_pay_okay").find(".returnToFristPage").attr("href", "#buyer_search_service");
		$("#page_pay_okay").find(".searchOrder").attr("href", "#");
		$("#page_pay_okay").find(".searchOrder").unbind("click");
		$("#page_pay_okay").find(".searchOrder").click(function() {
						getOrderForBuyer();
					});
		$.mobile.changePage("#page_pay_okay",{ transition: "pop"});
	}
	else
		Toast("下单失败，请稍后重试!",2000);
}

function getOrderForBuyer(username, password, page, size)
{
	username = window.localStorage.username;
	password = "111111";
	page = 1;
	size = 10;
	showLoadingDiv("正在为您加载");
	cordova.exec(getOrderSuccessPublicPart, callWebServiceError, 'TailorService', 'getOrders',[username, password, page, size]);
}

function getOrderItemsForShop(username, password, productName, studentName, mobile, start, end, page, size)
{
	showLoadingDiv("正在为您加载");
	username = window.localStorage.username;
	password = "111111";
	
	productName = "";
	studentName = "";
	mobile = "";
	start = "";
	end = "";
	page = 1;
	size = 10;
	cordova.exec(getOrderItemsPublicPart, callWebServiceError, 'TailorService' ,'getOrderItems', [username, password, 
	productName, studentName, mobile, start, end, page, size]);
}

function comfirmOrderForShopSuccess(message)
{
	hideLoadingDiv();
	if(message == "true")
	{
		Toast("订单确认成功！",2000);
		getOrderItemsForShop();
	}
	else
		Toast("订单确认失败，请稍后重试!",2000);
}

function applyProductForTailorSuccess(message)//调用服务许可申请接口成功,返回的是服务的备案号
{
	hideLoadingDiv();
	if(message == -1)
	{
		Toast("申请发送失败，请重试", 2000);
	}
	else if(message.length > 0)
	{
		Toast("申请已发送,请等候商家确认", 2000);
		openPackageList();
	}
	else{
		Toast("协议发送失败,请稍后重试", 3000);
	}
}

function openAuditListForShopSuccess(message)
{
	hideLoadingDiv();//注意在公共函数中不能重复，否则会出dom错误
	var jsonObject = eval("(" + message + ")");
	if(message == -1)
	{
		Toast("openAuditForShop异常", 2000);
		if($.mobile.activePage.attr("id") == "shop_service_manager")
			return;
		else
			$.mobile.changePage("#shop_service_manager");
	}
	else if(message == 0)
	{
		Toast("尚无协议需要审核", 2000);
		if($.mobile.activePage.attr("id") == "shop_service_manager")
			return;
		else
			$.mobile.changePage("#shop_service_manager");
	}
	else
		openAuditListSuccessPublicPart(jsonObject);
}

function manageAgreementForTailorSuccess(message)
{
	hideLoadingDiv();
	if(message == 0)
	{
		Toast("未找到该协议", 3000);
	}
	else if(message == 1)
	{
		Toast("协议被拒绝", 3000);
	}
	else
	{
		Toast("协议审核成功", 2000);
	}
	openAuditList();
}

function publishPackageForTailorSuccess(message)
{
	hideLoadingDiv();
	if(message != 1)
	{
		Toast("套票发布失败，请稍后重试", 2000);
		return;
	}
	else
	{
		clearSelectedProduct();//清空已选的服务备案号列表
		Toast("套票发布成功", 2000);
		openPackageList();
	}
}

function openPackageListForTailorSuccess(message)
{
	hideLoadingDiv();
	var jsonObject = eval("(" + message + ")");
	if(jsonObject.length == 0 || message == 0)
	{
		Toast("暂无已发布套票数据", 2000);
		if($.mobile.activePage.attr("id") == "tailor_data")
			return;
		else
			$.mobile.changePage("#tailor_data");
	}
	else if(jsonObject.length > 0)
	{
		openPackageListPublicPart(jsonObject);
	}
	else
	{
		Toast("数据加载出错", 2000);
		if($.mobile.activePage.attr("id") == "tailor_data")
			return;
		else
			$.mobile.changePage("#tailor_data");
	}
}
