// Import require Package
const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt, NumberPrompt} = require('botbuilder-dialogs');
const { CardFactory, MessageFactory } = require('botbuilder');

const { UserInfo } = require('./Resource/userInfo')

// Define the property accessors.
const BOT_PROMPT = "botPrompt"
const MAIN_PROMPT = "mainPrompt"
const TEXT_PROMPT = "textprompt"
const NUMBER_PROMPT = "numberprompt"

class MainDialog extends ComponentDialog {
    constructor(dialogStateAccessor, userProfileAccessor){
        super(MAIN_PROMPT)

        this.dialogStateAccessor = dialogStateAccessor
        this.userProfileAccessor = userProfileAccessor

        // Create Prompt Dialog
        this.addDialog(new TextPrompt(TEXT_PROMPT))
        this.addDialog(new NumberPrompt(NUMBER_PROMPT))

        // Create WaterfallDialog
        this.addDialog(new WaterfallDialog(BOT_PROMPT, [
                this.initializationStep.bind(this),
                this.Step1.bind(this),
                this.Step2.bind(this),
                this.Step3.bind(this),
                this.Step4.bind(this),
                this.Step5.bind(this),
                this.Step6.bind(this),
                this.Step7.bind(this),
                this.Step8.bind(this),
                this.Step9.bind(this),
                this.Step10.bind(this),
            ]))
            
        // Set initialDialogId
        this.initialDialogId = BOT_PROMPT
    }

    async run(turnContext) {
        // Create DialogSet Object
        const dialogSet = new DialogSet(this.dialogStateAccessor)
        dialogSet.add(this)

        // Creates a dialog context
        const dialogContext =  await dialogSet.createContext(turnContext)

        // ContinueDialog
        const result = await dialogContext.continueDialog()
        if (result.status === DialogTurnStatus.empty){
            // BeginDialog
            await dialogContext.beginDialog(this.id)
        }
    }

    async initializationStep(stepContext) {
        console.log("initializationStep")
        let userInfo = await this.userProfileAccessor.get(stepContext.context)
        await this.userProfileAccessor.set(stepContext.context, new UserInfo())
        if (userInfo === undefined) {
            if (stepContext.options && stepContext.options.userInfo) {
                await this.userProfileAccessor.set(stepContext.context, stepContext.options.userInfo);
            } else {
                await this.userProfileAccessor.set(stepContext.context, new UserInfo());
            }
        }
        return await stepContext.next() 
    }

    async Step1(stepContext) {
        console.log("Step1")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        await stepContext.context.sendActivity(`哈囉~`);

        let cCard1_D = ["1.早晨會議", "3.行政庶務", "4.MP技術會議", "2.KPI教用", "5.CaCafly", "10.台灣微軟總公司", "更多工作事項...", "新增工作事項"]
        const cCard1 = MessageFactory.suggestedActions(cCard1_D, "請選擇工作事項")
        if (!userInfo.u_p) {
            return await stepContext.prompt(TEXT_PROMPT, cCard1)
        } else {
            return await stepContext.next()
        }
    }

    async Step2(stepContext) {
        console.log("Step2")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.u_p === undefined && stepContext.result) {
            userInfo.u_p = stepContext.result

            // let day = stepContext.context.activity.localTimestamp.toString()
            // let re  = /\d{2}\:\d{2}\:\d{2}/
            // let td = re.exec(day)
            userInfo.u_t_1 = "9:00"
        }
        console.log("userPlan : ", userInfo.u_p)
        await stepContext.context.sendActivity(`Plan: ${userInfo.u_p}`)
        await stepContext.context.sendActivity(`Do: 1次`)
        await stepContext.context.sendActivity(`開始時間: ${userInfo.u_t_1}`)

        let fi_1 = "開始工作"+userInfo.u_p

        let cCard2_D = [fi_1, "修改開工作項目", "修改開始時間"]
        // let cCard2_D = ["開始工作", "修改開工作項目", "修改開始時間"]
        const cCard2 = MessageFactory.suggestedActions(cCard2_D)
        
        if (!userInfo.u_p_1) {
            return await stepContext.prompt(TEXT_PROMPT, cCard2)
        } else {
            return await stepContext.next()
        }
    }

    async Step3(stepContext) {
        console.log("Step3")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.u_p_1 === undefined && stepContext.result) {
            userInfo.u_p_1 = stepContext.result
        }
        console.log("userPlan_1 : ", userInfo.u_p_1)
        
        if (userInfo.u_p_1 == ("開始工作"+userInfo.u_p)) {
            await stepContext.context.sendActivity(`好的，請問${userInfo.u_p}的與會人數`);
                let cCard3_D = ["1", "2", "3", "自行輸入"]
                const cCard3 = MessageFactory.suggestedActions(cCard3_D)
                
                if (!userInfo.u_h) {
                    return await stepContext.prompt(TEXT_PROMPT, cCard3)
                } else {
                    return await stepContext.next()
                }
        } else if (userInfo.u_p_1 == "修改工作項目") {
            userInfo.u_p = undefined
            return await stepContext.beginDialog(MAIN_PROMPT)
        } else if (userInfo.u_p_1 == "修改開始時間") {
            userInfo.u_t_1 = undefined
            return await stepContext.beginDialog(MAIN_PROMPT)
        } else {
            await stepContext.context.sendActivity("我讓你用選的，沒叫你輸入好嗎")
            return await this.Step2(stepContext)
        }
    }

    async Step4(stepContext) {
        console.log("Step4")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.u_h === undefined && stepContext.result) {
            userInfo.u_h = stepContext.result
        }
        console.log("userHuman : ", userInfo.u_h)

        await stepContext.context.sendActivity("依照權重")
        let cCard4_D = ["V森", "Tina", "Shayna", "同部門同仁", "更多公司同仁", "合作廠商", "新增與會人員"]
        const cCard4 = MessageFactory.suggestedActions(cCard4_D, "請問與會人員是?")

        if (!userInfo.u_h_1) {
            return await stepContext.prompt(TEXT_PROMPT, cCard4)
        } else {
            return await stepContext.next()
        }
    }

    async Step5(stepContext) {
        console.log("Step5")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.u_h_1 === undefined && stepContext.result) {
            userInfo.u_h_1 = stepContext.result
        }
        console.log("userHuman_1 : ", userInfo.u_h_1)

        await stepContext.context.sendActivity(`Plan: ${userInfo.u_p}`)
        await stepContext.context.sendActivity(`Do: 1次`)
        await stepContext.context.sendActivity(`開始時間: ${userInfo.u_t_1}`)
        await stepContext.context.sendActivity(`與會人員: ${userInfo.u_h_1}`)

        if (!userInfo.u_a) {
            return await stepContext.prompt(TEXT_PROMPT, "請輸入會議主題")
        } else {
            return await stepContext.next()
        }
    }

    async Step6(stepContext) {
        console.log("Step6")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.u_a === undefined && stepContext.result) {
            userInfo.u_a = stepContext.result
        }
        console.log("userAction : ", userInfo.u_a)

        await stepContext.context.sendActivity(`Plan: ${userInfo.u_p}`)
        await stepContext.context.sendActivity(`Do: 1次`)
        await stepContext.context.sendActivity(`開始時間: ${userInfo.u_t_1}`)
        await stepContext.context.sendActivity(`與會人員: ${userInfo.u_h_1}`)
        await stepContext.context.sendActivity(`Act: ${userInfo.u_a}`)

        let cCard5_D = ["輸入會議記錄", "拍照上傳", "錄音", "上傳檔案", "會議結束", "修改剛才輸入的會議主題"]
        const cCard5 = MessageFactory.suggestedActions(cCard5_D)

        return await stepContext.prompt(TEXT_PROMPT, cCard5)
    }

    async Step7(stepContext) {
        console.log("Step7")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        let cCard5_D_7 = ["輸入會議記錄", "拍照上傳", "錄音", "上傳檔案", "會議結束", "修改剛才輸入的會議主題"]
        if (cCard5_D_7.includes(stepContext.result)) {
            userInfo.u_a_1 = stepContext.result
        } else {
            await stepContext.context.sendActivity("叫你用選的，沒叫你用打的")
            return await this.Step6(stepContext)
        }
        console.log("userAction_1 : ", userInfo.u_a_1)

        switch (userInfo.u_a_1) {
            case "輸入會議記錄":  
                if (!userInfo.u_c) {
                    return await stepContext.prompt(TEXT_PROMPT, `好的，請${userInfo.u_a_1}`)
                } else {
                    return await stepContext.next()
                    // return await stepContext.endDialog()
                }
            case "拍照上傳": 
                return await stepContext.beginDialog(MAIN_PROMPT)
            case "錄音": 
                return await stepContext.beginDialog(MAIN_PROMPT)
            case "上傳檔案": 
                return await stepContext.beginDialog(MAIN_PROMPT)
            case "修改剛才輸入的會議主題": 
                return await stepContext.beginDialog(MAIN_PROMPT)
            case "會議結束": 
                return await stepContext.beginDialog(MAIN_PROMPT)
            default:
                return await stepContext.beginDialog(MAIN_PROMPT)
        }
    }

    async Step8(stepContext) {
        console.log("Step8")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.u_c === undefined && stepContext.result) {
            userInfo.u_c = stepContext.result
        }
        console.log("userContext : ", userInfo.u_c)

        await stepContext.context.sendActivity(`Plan: ${userInfo.u_p}`)
        await stepContext.context.sendActivity(`Do: 1次`)
        await stepContext.context.sendActivity(`開始時間: ${userInfo.u_t_1}`)
        await stepContext.context.sendActivity(`與會人員: ${userInfo.u_h_1}`)
        await stepContext.context.sendActivity(`Act: ${userInfo.u_a}`)
        await stepContext.context.sendActivity(`備註: ${userInfo.u_c}`)

        let cCard9_D = ["輸入會議記錄", "拍照上傳", "錄音", "上傳檔案", "會議結束", "修改剛才輸入的會議主題"]
        const cCard9 = MessageFactory.suggestedActions(cCard9_D)

        return await stepContext.prompt(TEXT_PROMPT, cCard9)
    }

    async Step9(stepContext) {
        console.log("Step9")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        let cCard9_D_10 = ["輸入會議記錄", "拍照上傳", "錄音", "上傳檔案", "會議結束", "修改剛才輸入的會議主題"]
        if (cCard9_D_10.includes(stepContext.result)) {
            userInfo.u_a_2 = stepContext.result

            // let day = stepContext.context.activity.localTimestamp.toString()
            // let re  = /\d{2}\:\d{2}\:\d{2}/
            // let td = re.exec(day)
            userInfo.u_t_2 = "10:30"
        } else {
            await stepContext.context.sendActivity("叫你用選的，沒叫你用打的")
            return await this.Step8(stepContext)
        }
        console.log("userAction_2 : ", userInfo.u_a_2)

        await stepContext.context.sendActivity(`好的，辛苦了!`)
        await stepContext.context.sendActivity(`以下是${userInfo.u_p}記錄`)
        await stepContext.context.sendActivity(`Plan: ${userInfo.u_p}`)
        await stepContext.context.sendActivity(`Do: 1次`)
        await stepContext.context.sendActivity(`開始時間: ${userInfo.u_t_1}`)
        await stepContext.context.sendActivity(`結束時間: ${userInfo.u_t_2}`)
        await stepContext.context.sendActivity(`與會人員: ${userInfo.u_h_1}`)
        await stepContext.context.sendActivity(`Act: ${userInfo.u_a}`)
        await stepContext.context.sendActivity(`備註: ${userInfo.u_c}`)

        let cCard10_D = ["確認無誤", "修改剛才輸入的會紀錄"]
        const cCard10 = MessageFactory.suggestedActions(cCard10_D)

        if (!userInfo.u_l) {
            return await stepContext.prompt(TEXT_PROMPT, cCard10)
        } else {
            return await stepContext.next()
        }
    }

    async Step10(stepContext) {
        console.log("Step10")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.u_l === undefined && stepContext.result) {
            userInfo.u_l = stepContext.result
        }
        console.log("userLast : ", userInfo.u_l)

        await stepContext.context.sendActivity(`好的，辛苦了!`)
        await stepContext.context.sendActivity(`已經紀錄完成!!`)
        return await stepContext.endDialog()
    }
}

module.exports.MainDialog = MainDialog