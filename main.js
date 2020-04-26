let quoteBtn=document.querySelector(".quot");

function changeText()
{
  quoteBtn.style.backgroundColor="grey";
}
quoteBtn.addEventListener("click",changeText);

let loginPwdStatus=false;
function changePwdView(){
  let getLoginInput= document.getElementById("loginPwdChange");
  if(loginPwdStatus==false)
  {
    getLoginInput.setAttribute("type","text");
    loginPwdStatus=true;
  }
  else if(loginPwdStatus==true)
  {
    getLoginInput.setAttribute("type","password");
    loginPwdStatus=false;

  }

}