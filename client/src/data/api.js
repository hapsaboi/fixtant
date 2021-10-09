const BackEnd = process.env.REACT_APP_BackEndHost;

export const product = {
	//takes in a body with data
	//data :  
	// {
	// 	"product_name":"Tecno Camon CX",
	// 	"product_desc":"This product is a product",
	// 	"status":"true",
	// 	"brand":"Tecno",
	// 	"variations":[{"variation":"Black-64GB","buying_price":10000,"selling_price":20000}],
	// 	"store":"Hanis Store"
	// }
	addProduct: `${BackEnd}/api/product/add_product`,
	//---------------------------------------------------------------------------------------------------

	//data : store
	// {
	// 	"store":"Hanis Store"
	// }
	showStoreProducts: `${BackEnd}/api/product/show_store_products`,
	//---------------------------------------------------------------------------------------------------
	
	//data : product in JSON format
	// {
	// 	 -----
	// }
	updateProduct: `${BackEnd}/api/product/update_product`,
	//---------------------------------------------------------------------------------------------------

	
	//data : product in JSON format
	// {
	// 	 -----
	// }
	updateInventory: `${BackEnd}/api/product/update_inventory`,
	//---------------------------------------------------------------------------------------------------
};

export const service = {
	//take in a body with data
	//data :  
	// {
	// 	"product_name":"Screen Repair",
	// 	"product_desc":"This involves screen repair for mobile phones",
	// 	"price":"1000",
	// 	"store":"StoreID?"
	// }
	addService: `${BackEnd}/api/service/add_service`,

	//---------------------------------------------------------------------------------------------------

	//data : store
	// {
	// 	"store":"StoreID?"
	// }
	showStoreServices: `${BackEnd}/api/service/show_store_services`,
	//---------------------------------------------------------------------------------------------------
	
	//data : service in JSON format
	// {
	// 	 -----
	// }
	updateService: `${BackEnd}/api/service/update_service`,
	//---------------------------------------------------------------------------------------------------
};

export const sale = {
	//take in a body with data
	//data :  
	// {
	//     "buyer_name":"Hanis Hapsa",
	//     "phone":"09094******",
	//     "address":"Karewa Masakare",
	//     "payment_method":"Cash",
	// 	   "type":"sale || service"
	//     "items":[
	//          {"product_id":"60f71403c5b8cf2294520538","product_name":"Tecno Camon","quantity":10,"variation":"Medium","store":"Hive Store",price":20000}
	//      ]
	// }
	addSale: `${BackEnd}/api/sale/add_sale`,
	//---------------------------------------------------------------------------------------------------

	//data : store
	// {
	// 	"type":"sale || service",
	// }
	showSales: `${BackEnd}/api/sale/show_sales`,
	//---------------------------------------------------------------------------------------------------
	
};

export const changes = {
	//data : store
	// {
	// 	"store":"Hanis Store"
	// }
	showChanges: `${BackEnd}/api/change/show_changes`,

};

export const user = {
	//data : 
	// {
	// 	"store":"Hanis Store"
	// }
	editProfile: `${BackEnd}/api/user/edit_profile`,
};
export const authenticate = {
	//takes in token as http cookie
	//data : [verifyToken]
	verifyAcct: `${BackEnd}/api/user/verifyAccount/`,

	//takes in password + token as http cookie
	//data : [verifyToken]
	passwordReset: `${BackEnd}/api/user/passwordReset/`,

	//takes http cookie token and checks if a user is logged in
	//data : requires token to be set - user login
	loggedIn: `${BackEnd}/api/user/loggedIn`,

	//sends a reset link to specified user email
	//data : email
	forgotPassword: `${BackEnd}/api/user/forgotPassword`,

	//destroys cookie
	logout: `${BackEnd}/api/user/logout`,

	//destroys cookie
	addUser: `${BackEnd}/api/user/add_user`,
	
	//give logged in user data
	getUserData: `${BackEnd}/api/auth/user`,

	//---------
	userAuth: `${BackEnd}/api/auth`
};
