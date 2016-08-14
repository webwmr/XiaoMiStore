/**
 * Created by Administrator on 16-8-3.
 */

angular.module("cartMd", ["swxLocalStorage","utilMd"])
    .factory("cartService", function ($localStorage, util,$rootScope) {
        function myCart(cartName) {
            this.cartName = cartName;
            this.items = [];

            // 初始化时加载购物车
            this.loadItems();
            //this.clearItems();
        }

        // 从local storage加载购物车的产品
        myCart.prototype.loadItems = function () {
            var items = $localStorage.get(this.cartName + "_items");
            if (items != null) {
                this.items = items;
            }
        }

        // 保存购物车
        myCart.prototype.saveItems = function () {
            $localStorage.put(this.cartName+ "_items",this.items);
        }

        // 清空购物车
        myCart.prototype.clearItems = function () {
            this.items = [];
            this.saveItems();
        }

        // 立即购买将产品加入到购物车里
        myCart.prototype.addProductInCart = function (product) {
            var productIndexOf = util.contains(this.items,product);
            //如果产品已经存在购物车里则次产品的数量+1,否则直接把产品加入到购物车数组里
            if (productIndexOf != -1) {
                this.items[productIndexOf].quantity++;
            }
            else
            {
                var productNew = new productClass(product.productId, product.name, product.price, 1,product.img,false);
                this.items.push(productNew);
            }
            // save changes
            this.saveItems();
        }

        //购物车里产品的数量加减操作
        myCart.prototype.addNumber = function (product,number){
            if(product.quantity<=1 && number<0)
            {
                return;
            }
            product.quantity+=number;
        }
        //获取购物车的总价
        myCart.prototype.getTotalPrice = function (product,number){
            var total = 0;
            angular.forEach(this.items,function(item){
                if(item.isChecked){
                    total += item.quantity * item.price;
                }

            })
            return total;
        }
        //获取购物车被选择的产品数量
        myCart.prototype.getAllSelected = function (product,number){
            var selectedNum = 0;
            angular.forEach(this.items,function(item){
                if(item.isChecked)
                {
                    selectedNum+=1;
                }
            })
            return selectedNum;
        }
        //删除购物车里的产品
        myCart.prototype.removeItem = function (index){
            this.items.splice(index,1);
            this.saveItems();
        }
        // 创建我的购物车
        var myCartObj;
        if($rootScope.user!=null){//用户已经登录
            myCartObj = new myCart($rootScope.user.name);
        }

        // 服务返回我的购物车实例对象
        return {
            myCart: myCartObj
        };
    })

//构造函数：创建购物车里的产品
//{"productId":1,"name":"小米Max","price":"1499","img":"max","number":15,"fl_id":1},
function productClass(productId,name,price,quantity,img,isChecked)
{
    this.productId = productId;
    this.name = name;
    this.price = price * 1;
    this.quantity = quantity * 1;
    this.imgSrc = img;
    this.isChecked = isChecked;
}

