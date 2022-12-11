"use strict";

class UserStorage{
    static #users = {
        id: ["admin", "guest",],
        password: ["admin", "",],
    };
    
    static getUsers(...fields){
        const users = this.#users;
        const newUsers = fields.reduce( (newUsers,field) => {
                if(users.hasOwnProperty(field)){
                    newUsers[field] = users[field];
                }
                return newUsers;
            },{});
        return newUsers;
    }
    
}
//reduce에 대한 설명
//reduce( 콜백함수,누산기에 들어갈 최초값) 으로 구성된다.
//콜백함수는 다시 (누산기,처리할요소,현재처리하고있는데이터의인덱스값,배열자체) => {reuturn}으로 구성된다.
//처리할 요소는 reduce를 호출한 배열의 첫 원소부터 시작해서 차례로 대입하는듯 하다.
//즉 fields의 각 요소들을 field라는 요소로 쪼개서 차례로 대입해 콜백이 끝날때마다 다음 요소로 넘어가는 매커니즘.


module.exports = UserStorage;