class UserInfo {

     //#region parameter
    //  plan             選擇的方案
    //  addr             宅配地址
    //  payment          付款方式
    //  pick_up          取貨方式
    //  specification    規格 ex: ["紅色 大", "藍色 中", "黃色 小"]
    //  recipient_name   收件人姓名
    //  recipient_phone  收件人電話
    //  recipient_mail   收件人信箱
    //  purchaser_name   購買人姓名
    //  purchaser_phone  購買人電話
    //  purchaser_mail   購買人信箱
    //#endregion

    constructor (u_p, u_p_1, u_t_1, u_t_2, u_h, u_h_1, u_a, u_a_1, u_a_2, u_c, u_l) 
    {
        this.u_p = u_p || undefined;
        this.u_p_1 = u_p_1 || undefined;
        this.u_t_1 = u_t_1 || undefined;
        this.u_t_2 = u_t_2 || undefined;
        this.u_h = u_h || undefined;
        this.u_h_1 = u_h_1 || undefined;
        this.u_a = u_a || undefined;
        this.u_a_1 = u_a_1 || undefined;
        this.u_a_2 = u_a_2 || undefined;
        this.u_c = u_c || undefined;
        this.u_l = u_l || undefined;

    }
}

exports.UserInfo = UserInfo;
