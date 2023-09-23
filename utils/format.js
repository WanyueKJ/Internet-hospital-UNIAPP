/**
 * 获取格式化后的当天时间
 */
export function getTodayFormat() {
	var date = new Date(),
		year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate(),
		hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
		minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
		second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
	month >= 1 && month <= 9 ? (month = '0' + month) : '';
	day >= 0 && day <= 9 ? (day = '0' + day) : '';
	var timer = year + '-' + month + '-' + day;
	return timer;
}

export function getNowFormateTime() {
	const formatNumber = n => {
		n = n.toString()
		return n[1] ? n : '0' + n
	}
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	const formattedTime =
		`${year}-${formatNumber(month)}-${formatNumber(day)} ${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
	return formattedTime;
}
/**
 * 信息格式化
 */
export function userinfoFormat(info) {
	let space = ' ';
	let name = (info.name ? info.name : '') + space;
	let sex = info.sex + space;
	let birthday = info.birth ? info.birth : '-';
	let age = userAgeFormat(birthday.split('-')) + space;
	
	let weight_kg = (info.weight ? info.weight : '') + 'kg' + space;
	let res = name + sex + age + weight_kg;
	return res
}
/**
 * 传入:数组【年,月,日】
 * 返回:'1岁/1月/1天'
 */
export function userAgeFormat(birthday) {
	// 新建日期对象
	let date = new Date();
	// 今天日期，数组，同 birthday
	let today = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
	// 分别计算年月日差值
	let age = today.map((value, index) => {
		return value - birthday[index];
	});
	// 当天数为负数时，月减 1，天数加上月总天数
	if (age[2] < 0) {
		// 简单获取上个月总天数的方法，不会错
		let lastMonth = new Date(today[0], today[1], 0);
		age[1]--;
		age[2] += lastMonth.getDate();
	}
	// 当月数为负数时，年减 1，月数加上 12
	if (age[1] < 0) {
		age[0]--;
		age[1] += 12;
	}
	//return age;

	let ageStr = '';
	if (age[0]) {
		ageStr = age[0] + '岁';
	} else {
		if (age[1]) {
			ageStr = age[1] + '个月';
		} else {
			ageStr = age[2] + '天';
		}
	}
	return ageStr;
}
