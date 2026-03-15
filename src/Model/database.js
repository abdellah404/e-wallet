const database={

    users:[
      {id:"1",
       name:"Ali", 
       email:"Ali@example.com",
       password:"1232",
       wallet:{
        balance:12457, 
        currency:"MAD",
        cards:[
            {numcards:"124847", type:"visa",balance:"14712",expiry:"14-08-27",vcc:"147"},
            {numcards:"124478", type:"mastercard",balance:"1470",expiry:"14-08-28",vcc:"257"},
        ],
        transactions:[
             {id:"1", type:"credit",amount:140,date:"14-08-25", from:"Ahmed" , to:"124847"},
               {id:"2", type:"debit",amount:200,date:"13-08-25", from:"124847" , to:"Amazon"},
              {id:"3", type:"credit",amount:250,date:"12-08-25", from:"Ahmed" , to:"124478"},
        ]

       }
      },
      {
        id:"2",
        name:"abdellah", 
        email:"abdellah@example.com",
        password:"456",
        wallet:{
            balance:12457,
            currency:"MAD",
            cards:[
                {numcards:"124847", type:"visa",balance:"14712",expiry:"14-08-27",vcc:"147"},
                {numcards:"124478", type:"mastercard",balance:"1470",expiry:"14-08-28",vcc:"257"},
            ],
            transactions:[
                    {id:"1", type:"credit",amount:140,date:"14-08-25", from:"Ahmed" , to:"124847"},
                    {id:"2", type:"debit",amount:200,date:"13-08-25", from:"124847" , to:"Amazon"},
                    {id:"3", type:"credit",amount:250,date:"12-08-25", from:"Ahmed" , to:"124478"},
            ]  
      },
      
      },
      {
        id:"3",
        name:"mohammed", 
        email:"mohammed@example.com",
        password:"789",
        wallet:{
            balance:8500,
            currency:"MAD",
            cards:[
                {numcards:"124956", type:"visa",balance:"9200",expiry:"20-12-26",vcc:"456"},
            ],
            transactions:[
                {id:"1", type:"credit",amount:500,date:"14-08-25", from:"Ali" , to:"124956"},
            ]  
        }
      },
      
      {
        id:"4",
        name:"fatima", 
        email:"fatima@example.com",
        password:"101112",
        wallet:{
            balance:5300,
            currency:"MAD",
            cards:[
                {numcards:"124789", type:"visa",balance:"5500",expiry:"10-06-27",vcc:"789"},
            ],
            transactions:[
                {id:"1", type:"credit",amount:300,date:"14-08-25", from:"Mohammed" , to:"124789"},
            ]  
        }
      }
    ]
}



const finduserbymail = (mail,password)=>{
    return database.users.find((u)=> u.email===mail && u.password===password
    );
}

const findUserById = (id) => database.users.find((u) => u.id === String(id));


const getAllUsers = () => database.users;



export default finduserbymail ;
export {findUserById, getAllUsers};
