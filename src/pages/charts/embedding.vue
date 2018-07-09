<template>
    <div id="embedding">
        <el-card class="box-card"
            style="text-align: left;margin-bottom: 20px;text-align: center;overflow:scroll;height:100vh;overflow:scroll;color: #ffffff;">
            <!--productName-->
            <el-form ref="form" label-width="80px"
                style="display: inline-block;line-height:40px;margin:62px 1% 0px 2%;">
                <el-form-item label="FileName：">
                    <el-select v-model="productName" @input="changeFile()"
                        style="">
                        <el-option v-for="item in productNames" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div style="width: 7500px;height:600px;text-align: left;">
                <div style="margin: 0px 1px">
                    <div style="font-weight: 600;display: inline-block;outline: 1px solid #000000;"
                        v-for="item in cssObj">
                        <div class="edbSpan" style="text-align: center;" :class="changeCss(item.member[0])">
                            {{item.name}}
                        </div>
                        <br>
                        <div class="ebdList" v-for="emnu in item.member"
                            :class="changeCss(emnu)">
                            {{emnu}}
                        </div>
                    </div>
                </div>

                <ul v-for="emnu in tableData" style="border-bottom: 1px solid #000000;width: 180px;float: left;">
                    <li class="ebdList" style="display: block;border: 1px solid #000000;" v-for="item in
                    emnu.mostSimApp"
                        :class="changeCss(item)">
                        {{item}}
                    </li>
                </ul>
            </div>
            <!--<div style="margin: 0px auto 30px">-->
            <!--<el-table :data="tableData" stripe header-align="center" border height="500"-->
            <!--style="min-width: 0px;margin-top: 50px;overflow-y: auto;overflow-x:-->
            <!--hidden;float:-->
            <!--right;text-align:center">-->
            <!--<el-table-column v-for="item in subTitle" :prop="item" :label="item"-->
            <!--header-align="center" sortable>-->
            <!--{{item}}-->
            <!--</el-table-column>-->
            <!--</el-table>-->
            <!--</div>-->
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "embedding",
        data() {
            return {
                tableData: [],
                subTitle: [],
                tableName: '',
                productName: '',
                productNames: [],
                cssObj: {
                    application: {
                        name: '普通应用',
                        member: ["微信", "QQ", "微博", "百度贴吧", "快手", "哔哩哔哩", "探探"]
                    },
                    market: {
                        name: '应用市场',
                        member: ["PP助手", "豌豆荚", "安智市场", "应用宝", "淘宝手机助手", "Google Play", "酷安"]
                    },
                    synthesizeLoan: {
                        name: '综合金融',
                        member: ["京东金融", "佑米金融", "你我贷投资", "玖富金融", "鑫合汇网贷", "拉卡拉", "51人品"]
                    },
                    supermarketOrange: {
                        name: '贷款超市',
                        member: ["融360", "钱宝", "现金白卡", "快贷", "给你花", "现金借款", "贷款快", "贷嘛"]
                    },
                    supermarketAndLoan: {
                        name: '贷款超市同时自身做贷款',
                        member: ["卡牛信用管家", "2345贷款王借款", "百度财富"]
                    },
                    supermarketPurple: {
                        name: '小贷应用',
                        member: ["来分期", "飞贷", "花无缺借款", "我来贷", "贷上钱", "简单借款", "小花钱包", "随手借"]
                    }
                }
            }
        },
        mounted() {
            this.$ajax.get('/ebdFailArr', {
                url: '/ebdFailArr',
                baseURL: process.env.API_BASEURL,
            }).then(res => {
                this.productNames = res.data;
                this.productName = this.productNames[0];
            }).then(() => {

                this.changeFile()


            });
        },
        methods: {
            changeCss(item) {
                for (let menu in this.cssObj) {
                    for (let i = 0, l = this.cssObj[menu].member.length; i < l; i++) {
                        if (item.indexOf(this.cssObj[menu].member[i]) > -1) {
                            return menu;
                        }

                    }
                }

            },

            changeFile() {
                this.$ajax.get(`/${this.productName}`, {
                    url: `/${this.productName}`,
                    baseURL: process.env.API_BASEURL,
                }).then(res => {
                    this.subTitle = res.data.dataTitle;
                    this.tableData = res.data.data;
                })
            }
        }
    }
</script>

<style scoped>
    .ebdList {
        display: inline-block;
        min-width: 180px;
        list-style: none;
        height: 35px;
        line-height: 35px;
        text-align: center;
        white-space: nowrap;
    }

    .edbSpan {
        display: inline-block;
        height: 45px;
        line-height: 45px;
        white-space: nowrap;
        width: 100%;
        border-bottom: 1px solid #FFFFFF;
    }

    .application {
        background: rgb(0, 113, 192);
    }

    .market {
        background: rgb(0, 162, 183);
    }

    .synthesizeLoan {
        background: rgb(48, 84, 150);
    }

    .supermarketOrange {
        background: rgb(198, 87, 17);
    }

    .supermarketAndLoan {
        background: rgb(84, 130, 57);
    }

    .supermarketPurple {
        background: rgb(112, 48, 160);
    }
</style>
