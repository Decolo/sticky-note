class Toast {
  constructor(msg, time){
    this.msg = msg
    // this.isShow = false
    this.dismissTime = time || 1000
    this.container = document.createElement('div')
    this.container.classList.add('toast-container')
    this.createToast()
    this.displayToast()
  }
  createToast() {
    let template = `<p className="toast">${this.msg}</p>`
    this.container.innerHTML = template
    // this.container.style.visibility = 'hidden'
    document.body.appendChild(this.container)
    // this.isShow = true
  }
  displayToast() {
    setTimeout(() => {
      this.container.parentElement.removeChild(this.container)
    }, this.dismissTime)
  }
}
export default function(msg, time) {
  new Toast(msg, time)
}
