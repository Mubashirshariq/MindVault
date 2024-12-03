export function generateShareLink(len:number){
    let ans="";
    let salt="qwhdiyrtopshatiwkoankodouqanfdh83920908427kasjnf";

    for(let i=0;i<len;i++){
        ans+=salt[Math.floor((Math.random())*salt.length)];
    }
    return ans;
}