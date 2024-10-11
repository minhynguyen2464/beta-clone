/**
 * Created by CTT VNPAY
 */

let express = require('express');
let router = express.Router();
let $ = require('jquery');
const request = require('request');
const moment = require('moment');
const Booking = require('../models/booking.model');
const Movie = require('../models/movie.model');
var nodemailer = require('nodemailer');

// router.get('/', function(req, res, next){
//     res.render('orderlist', { title: 'Danh sách đơn hàng' })
// });

router.get('/create_payment_url', function (req, res, next) {
	const amount = req.query.price;
	const bookingID = req.query.bookingID;
	console.log(bookingID);
	if (bookingID === undefined) {
		res.render('./users/login');
	}
	res.render('./users/order', {
		title: 'Tạo mới đơn hàng',
		amount: amount,
		orderId: bookingID,
	});
});

router.get('/querydr', function (req, res, next) {
	let desc = 'truy van ket qua thanh toan';
	res.render('querydr', { title: 'Truy vấn kết quả thanh toán' });
});

router.get('/refund', function (req, res, next) {
	let desc = 'Hoan tien GD thanh toan';
	res.render('refund', { title: 'Hoàn tiền giao dịch thanh toán' });
});

router.post('/create_payment_url', function (req, res, next) {
	process.env.TZ = 'Asia/Ho_Chi_Minh';

	let date = new Date();
	let createDate = moment(date).format('YYYYMMDDHHmmss');

	let ipAddr =
		req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;

	let config = require('config');

	let tmnCode = config.get('vnp_TmnCode');
	let secretKey = config.get('vnp_HashSecret');
	let vnpUrl = config.get('vnp_Url');
	let returnUrl = config.get('vnp_ReturnUrl');
	let orderId = req.body.orderID;
	let amount = req.body.amount; //Số tiền
	let bankCode = req.body.bankCode;

	let locale = req.body.language;
	if (locale === null || locale === '') {
		locale = 'vn';
	}
	let currCode = 'VND';
	let vnp_Params = {};
	vnp_Params['vnp_Version'] = '2.1.0';
	vnp_Params['vnp_Command'] = 'pay';
	vnp_Params['vnp_TmnCode'] = tmnCode;
	vnp_Params['vnp_Locale'] = locale;
	vnp_Params['vnp_CurrCode'] = currCode;
	vnp_Params['vnp_TxnRef'] = orderId;
	vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
	vnp_Params['vnp_OrderType'] = 'other';
	vnp_Params['vnp_Amount'] = amount * 100;
	vnp_Params['vnp_ReturnUrl'] = returnUrl;
	vnp_Params['vnp_IpAddr'] = ipAddr;
	vnp_Params['vnp_CreateDate'] = createDate;
	if (bankCode !== null && bankCode !== '') {
		vnp_Params['vnp_BankCode'] = bankCode;
	}

	vnp_Params = sortObject(vnp_Params);

	let querystring = require('qs');
	let signData = querystring.stringify(vnp_Params, { encode: false });
	let crypto = require('crypto');
	let hmac = crypto.createHmac('sha512', secretKey);
	let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
	vnp_Params['vnp_SecureHash'] = signed;
	vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

	res.redirect(vnpUrl);
});

const sendMailToClient = async (orderID, showtime) => {
	const booking = await Booking.findOne({ _id: orderID })
		.populate('movie')
		.populate('user');
	console.log(booking);
	const movie = booking.movie;
	const user = booking.user;
	const number = booking.price;
	const formattedNumber = number
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	var transporter = await nodemailer.createTransport({
		service: 'gmail',
		auth: {
			//Nhập pass và mail
			user: 'abc@gmail.com',
			pass: 'mefc uopb gqhl kgdv',
		},
	});

	var mailOptions = {
		from: 'minhynguyen97@gmail.com',
		to: `${user.email}`,
		subject: 'Beta Cinemas: Giao Dich Thanh Cong',
		html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h4 style="color: #007bff;">Beta Quang Trung</h4>
            <p>33A duong 30/4 thanh pho Vung Tau</p>
            <p>${moment(booking.bookedAt).format('DD/MMM/YYYY HH:mm')}</p>
            <p>===================================================</p>
            <h3 style="font-size: 24px;">2DSUB ${movie.title}</h3>
            <div style="display: flex; flex-wrap: wrap; margin-bottom: 15px;">
                <div style="flex: 50%; max-width: 50%; padding: 0 10px; box-sizing: border-box;">
                    ${moment(showtime.time).format('DD/MMM/YYYY')}
                </div>
                <div style="flex: 50%; max-width: 50%; padding: 0 10px; box-sizing: border-box;">
                    ${moment(showtime.time).format('HH:mm')}
                </div>
                <div style="flex: 50%; max-width: 50%; padding: 0 10px; box-sizing: border-box;">
                    <h3 style="margin: 0;">${showtime.cinemaRoom}</h3>
                </div>
                <div style="flex: 50%; max-width: 50%; padding: 0 10px; box-sizing: border-box;">
                    <h3 style="margin: 0;">${booking.seats}</h3>
                </div>
            </div>
            <p>===================================================</p>
            <div style="display: flex; flex-wrap: wrap; margin-bottom: 15px;">
                <div style="flex: 50%; max-width: 50%; padding: 0 10px; box-sizing: border-box;">
                    <h5 style="margin: 0;">${booking.seatsType} ticket</h5>
                    <p style="margin: 8px 0;">-Ticket price</p>
                    <p style="margin: 8px 0;">-Status</p>
                </div>
                <div style="flex: 50%; max-width: 50%; padding: 0 10px; box-sizing: border-box;">
                    <h5 style="margin: 0;">VND: ${formattedNumber}</h5>
                    <p style="margin: 8px 0;">${formattedNumber} (bao gom 5% VAT)</p>
                    <p style="margin: 8px 0;"><i class="fa-solid fa-check" style="color: green;"></i> Da thanh toan</p>
                </div>
            </div>
        </div>
        `,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
};

router.get('/vnpay_return', function (req, res, next) {
	let vnp_Params = req.query;

	let secureHash = vnp_Params['vnp_SecureHash'];

	delete vnp_Params['vnp_SecureHash'];
	delete vnp_Params['vnp_SecureHashType'];

	vnp_Params = sortObject(vnp_Params);

	let config = require('config');
	let tmnCode = config.get('vnp_TmnCode');
	let secretKey = config.get('vnp_HashSecret');
	let rspCode = vnp_Params['vnp_ResponseCode']; //Thêm vào
	let querystring = require('qs');
	let signData = querystring.stringify(vnp_Params, { encode: false });
	let crypto = require('crypto');
	let hmac = crypto.createHmac('sha512', secretKey);
	let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

	if (secureHash === signed) {
		if (rspCode == '00') {
			//Thêm vào
			//Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
			//thanh cong
			let orderId = req.query.vnp_TxnRef;
			const query = { _id: orderId };
			const update = {
				price: vnp_Params['vnp_Amount'] / 100,
				transactionDate: new Date(),
				status: 1,
			};
			options = { upsert: true, new: true, setDefaultsOnInsert: true };
			Booking.findOneAndUpdate(query, update, options)
				.then(() => {
					//Cập nhật lại số ghế ngồi
					Booking.findById({ _id: orderId })
						.exec() //Query để tìm movie id
						.then((data) => {
							Movie.findById(data.movie) //Query để tìm showtime
								.then((movie) => {
									const showtime = movie.showtimes.find((showtime) =>
										showtime._id.equals(data.showtimes)
									); //3 Query
									showtime.seatsBooked.push(data.seats);
									showtime.seatsBooked = showtime.seatsBooked.flat();
									movie.save(); //Update seat cho showtime ở model Movie
									// Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
									sendMailToClient(orderId, showtime);
									res.render('./users/success', {
										code: vnp_Params['vnp_ResponseCode'],
									});
								})
								.catch((err) => {
									console.error(err);
								});
						})
						.catch((err) => {
							console.error(err);
						});
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			//paymentStatus = '2'
			let orderId = req.query.vnp_TxnRef;
			Booking.findOneAndDelete({ _id: orderId })
				.then(() => {
					res.render('./users/success', {
						code: vnp_Params['vnp_ResponseCode'],
					});
				})
				.catch((err) => {
					console.error(err);
				});
		}
	} else {
		res.render('./users/success', { code: '97' });
	}
});

router.get('/vnpay_ipn', function (req, res, next) {
	let vnp_Params = req.query;
	let secureHash = vnp_Params['vnp_SecureHash'];

	let orderId = vnp_Params['vnp_TxnRef'];
	let rspCode = vnp_Params['vnp_ResponseCode'];

	delete vnp_Params['vnp_SecureHash'];
	delete vnp_Params['vnp_SecureHashType'];

	vnp_Params = sortObject(vnp_Params);
	let config = require('config');
	let secretKey = config.get('vnp_HashSecret');
	let querystring = require('qs');
	let signData = querystring.stringify(vnp_Params, { encode: false });
	let crypto = require('crypto');
	let hmac = crypto.createHmac('sha512', secretKey);
	let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

	let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
	//let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
	//let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

	let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
	let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
	if (secureHash === signed) {
		//kiểm tra checksum
		if (checkOrderId) {
			if (checkAmount) {
				if (paymentStatus == '0') {
					//kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
					if (rspCode == '00') {
						paymentStatus = '1';
						res.status(200).json({ RspCode: '00', Message: 'Success' });
					} else {
						//that bai
						paymentStatus = '2';
						// Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
						res.status(200).json({ RspCode: '00', Message: 'Success' });
					}
				} else {
					res.status(200).json({
						RspCode: '02',
						Message: 'This order has been updated to the payment status',
					});
				}
			} else {
				res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
			}
		} else {
			res.status(200).json({ RspCode: '01', Message: 'Order not found' });
		}
	} else {
		res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
	}
});

router.post('/querydr', function (req, res, next) {
	process.env.TZ = 'Asia/Ho_Chi_Minh';
	let date = new Date();

	let config = require('config');
	let crypto = require('crypto');

	let vnp_TmnCode = config.get('vnp_TmnCode');
	let secretKey = config.get('vnp_HashSecret');
	let vnp_Api = config.get('vnp_Api');

	let vnp_TxnRef = req.body.orderId;
	let vnp_TransactionDate = req.body.transDate;

	let vnp_RequestId = moment(date).format('HHmmss');
	let vnp_Version = '2.1.0';
	let vnp_Command = 'querydr';
	let vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;

	let vnp_IpAddr =
		req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;

	let currCode = 'VND';
	let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

	let data =
		vnp_RequestId +
		'|' +
		vnp_Version +
		'|' +
		vnp_Command +
		'|' +
		vnp_TmnCode +
		'|' +
		vnp_TxnRef +
		'|' +
		vnp_TransactionDate +
		'|' +
		vnp_CreateDate +
		'|' +
		vnp_IpAddr +
		'|' +
		vnp_OrderInfo;

	let hmac = crypto.createHmac('sha512', secretKey);
	let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest('hex');

	let dataObj = {
		vnp_RequestId: vnp_RequestId,
		vnp_Version: vnp_Version,
		vnp_Command: vnp_Command,
		vnp_TmnCode: vnp_TmnCode,
		vnp_TxnRef: vnp_TxnRef,
		vnp_OrderInfo: vnp_OrderInfo,
		vnp_TransactionDate: vnp_TransactionDate,
		vnp_CreateDate: vnp_CreateDate,
		vnp_IpAddr: vnp_IpAddr,
		vnp_SecureHash: vnp_SecureHash,
	};
	// /merchant_webapi/api/transaction
	request(
		{
			url: vnp_Api,
			method: 'POST',
			json: true,
			body: dataObj,
		},
		function (error, response, body) {
			console.log(response);
		}
	);
});

router.post('/refund', function (req, res, next) {
	process.env.TZ = 'Asia/Ho_Chi_Minh';
	let date = new Date();

	let config = require('config');
	let crypto = require('crypto');

	let vnp_TmnCode = config.get('vnp_TmnCode');
	let secretKey = config.get('vnp_HashSecret');
	let vnp_Api = config.get('vnp_Api');

	let vnp_TxnRef = req.body.orderId;
	let vnp_TransactionDate = req.body.transDate;
	let vnp_Amount = req.body.amount * 100;
	let vnp_TransactionType = req.body.transType;
	let vnp_CreateBy = req.body.user;

	let currCode = 'VND';

	let vnp_RequestId = moment(date).format('HHmmss');
	let vnp_Version = '2.1.0';
	let vnp_Command = 'refund';
	let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;

	let vnp_IpAddr =
		req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;

	let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

	let vnp_TransactionNo = '0';

	let data =
		vnp_RequestId +
		'|' +
		vnp_Version +
		'|' +
		vnp_Command +
		'|' +
		vnp_TmnCode +
		'|' +
		vnp_TransactionType +
		'|' +
		vnp_TxnRef +
		'|' +
		vnp_Amount +
		'|' +
		vnp_TransactionNo +
		'|' +
		vnp_TransactionDate +
		'|' +
		vnp_CreateBy +
		'|' +
		vnp_CreateDate +
		'|' +
		vnp_IpAddr +
		'|' +
		vnp_OrderInfo;
	let hmac = crypto.createHmac('sha512', secretKey);
	let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest('hex');

	let dataObj = {
		vnp_RequestId: vnp_RequestId,
		vnp_Version: vnp_Version,
		vnp_Command: vnp_Command,
		vnp_TmnCode: vnp_TmnCode,
		vnp_TransactionType: vnp_TransactionType,
		vnp_TxnRef: vnp_TxnRef,
		vnp_Amount: vnp_Amount,
		vnp_TransactionNo: vnp_TransactionNo,
		vnp_CreateBy: vnp_CreateBy,
		vnp_OrderInfo: vnp_OrderInfo,
		vnp_TransactionDate: vnp_TransactionDate,
		vnp_CreateDate: vnp_CreateDate,
		vnp_IpAddr: vnp_IpAddr,
		vnp_SecureHash: vnp_SecureHash,
	};

	request(
		{
			url: vnp_Api,
			method: 'POST',
			json: true,
			body: dataObj,
		},
		function (error, response, body) {
			console.log(response);
		}
	);
});

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			str.push(encodeURIComponent(key));
		}
	}
	str.sort();
	for (key = 0; key < str.length; key++) {
		sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
	}
	return sorted;
}

module.exports = router;
