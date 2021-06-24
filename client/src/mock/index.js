import Mock from "mockjs";
import loginAPI from "./login";
import remoteSearchAPI from "./remoteSearch";
import tableAPI from "./table";

// 登录与用户相关
Mock.mock(/\/logout/, "post", loginAPI.logout);
Mock.mock(/\/user\/list/, "get", loginAPI.getUsers);
Mock.mock(/\/user\/delete/, "post", loginAPI.deleteUser);
Mock.mock(/\/user\/edit/, "post", loginAPI.editUser);
Mock.mock(/\/user\/validatUserID/, "post", loginAPI.ValidatUserID);
Mock.mock(/\/user\/add/, "post", loginAPI.addUser);


// dashboard
Mock.mock(/\/transaction\/list/, "get", remoteSearchAPI.transactionList);

// table
Mock.mock(/\/table\/delete/, "post", tableAPI.deleteItem);


export default Mock;
