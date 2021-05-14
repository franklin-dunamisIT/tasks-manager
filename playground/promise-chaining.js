require('../src/db/mongoose')
const User = require('../src/models/user')

User.findByIdAndUpdate('60400f0e689c9ec049672e18', {age: 1}).then((user)=>{
    console.log(user)
    return User.countDocuments({age: 1}) // returns a promise which returns the result in the next then
}).then((result) => {
    console.log(result)

}).catch((e) => {
    console.log(e)

})


const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age})

    return count
}


updateAgeAndCount('60400f0e689c9ec049672e18', 11).then((count)=> {
    console.log(count)
}).catch((e)=>{
    console.log(e)

})