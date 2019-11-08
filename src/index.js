import b from './b';
b().a=5;

new Promise((resolve,reject)=>{
    import('./b').then(({default:b})=>{
        console.log(b())
    })
})