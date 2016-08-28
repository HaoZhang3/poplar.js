/**
 * Created by Poplar on 2016/8/18.
 */
(function( window,undefined ){

    //定义poplar构造函数(对外暴露的只有一个poplar)
    function poplar(selector){
        //把创建实例函数封装到函数中
        return new poplar.fn.init( selector );
    }

    //构造函数的原型
    poplar.fn=poplar.prototype = {
        constructor:poplar,
        type:'poplar',
        //实际上的构造函数(核心内容)
        init: function ( selector ) {
            if( !selector ){
                return this;
            };
            //str
            if( typeof selector == 'string'){
                //如果是html字符串
                if( selector.charAt( 0 ) == '<'){
                    //将字符串转化为dom 并加到this中
                    [].push.apply( this,poplar.praseHTML( selector ));
                }else{
                    //如果是选择器 获取元素加到this中
                    [].push.apply( this,poplar.select( selector ))
                };
                return this
            }
            //function
            if( typeof selector == 'function'){
                var oldFunc = window.onload;
                if( typeof oldFunc === 'function' ){
                    //selector();
                    //oldFunc();
                    window.onload= function () {
                        oldFunc();
                        selector();
                    }

                } else {
                    selector();
                }

            }
            //dom
            if( selector.nodeType ){

                this[0] = selector;
                this.length = 1;
                return this;
            }

            //poplar
            if ( selector.type =='poplar' ){
                [].push.apply( this,selector )
            }

            //数组
            if(selector.length >= 0){
                [].push.apply( this,selector )
            }else{
                this[0] = selector;
                this.length = 1;
            }
            return this;

            //不知道的默认return this

        },
        //实例中的each
        each: function ( callback ) {

            poplar.each( this, callback );
            return this;
        },
        map: function (callback) {
            return poplar.map(this.callback)
        },
        //将poplar的对象转化成数组返回
        toArray: function () {
            return [].slice.call(this,0)
        },

        //根据参数返回DOM对象或者DOM数组

        get: function (index) {
            if( index==undefined){
                return this.toArray();
            }else{
                if(index>0){
                    return this[index];
                }else{
                    return this[this.length+index];
                }
            }
        },

        //返回poplar对象
        eq: function (index) {
            var newObj = this.constructor( this.get( index ));
            newObj.prev = this;
            return newObj;
        },

        first: function () {
            return this.eq(0)
        },

        last: function () {
            return this.eq(-1)
        },

        each: function (callback) {
            poplar.each(this,callback);
            return this;
        },
        map: function (callback) {

            return poplar.map(this,callback);
        },



    }
    //为了让构造函数的实例对象可以很方便的添加方法，
    //让poplar和init的原型指向同一个对象
    poplar.fn.init.prototype = poplar.fn;

    //添加 extend 方法
    poplar.extend = poplar.fn.extend = function (obj) {
        for ( var k in obj ){
            this[k] = obj[k];
        }
    }

    //核心模块工具方法
    //添加核心模块的方法


    poplar.extend({
        each: function (array, callback) {
            if( array.length >=0 ){
                for( var i = 0; i< array.length;i++){
                    var res = callback.call(array[i],i,array[i]);
                    if(res=false){
                        break;
                    }
                }
            }else{
                for( var k in array){
                    var res = callback.call(array[k],k,array[k]);
                    if(res=false){
                        break;
                    }
                }
            }
        },
        map: function (array, callback) {
            var res = [];
            //数组 伪数组
            if ( array.length >= 0) {
                for (var i = 0; i < array.length; i++) {
                    var v = callback(array[i], i);
                    if (v !== undefined) {
                        res.push( v );
                    }
                }
            } else {
                for ( var k in array ){
                    var v = callback( array[ k ], k)
                    if ( v !== undefined ){
                        res.push( v )
                    }

                }
            };
            return res;
        }

    })


    //事件追加
    poplar.fn.extend({
        on:function ( type,callback ){

           return this.each(
                function (i, v) {
                    this[ 'on' + type ] = callback
                }
            )

        }
    })

    //选择器
    var select =(function () {
    //定义一个support对象 储存选择器的兼容能力
        var support = {},
            rnative=/\[native code\]/;


        //先判断qsa
        support.qsa=rnative.test('document.querySlectorAll');
        support.getElementsByClassName = rnative.test( 'document.getElementByClassName ');
        //因为document下面的gec和node下面的不一样 所以需要再次判断
        var div = document.createElement( 'div' )
        support.getElementsByClassName2 = rnative.test(' div.createElementsByClassName');
        support.trim = rnative.test( String.prototype.trim)


        //indexOf
        support.indexOf = rnative.test( Array.prototype.indexOf );

        function indexOf( array,search,startIndex){
            startIndex = startIndex || 0;
            if(support.index){
                return array.indexOf( search,startIndex )
            }
            for ( var i = startIndex; i < array.length;i++){
                if( array[i] === search ){
                    return i;
                }
            }
            return -1;
        }

        function unique( arr ){
            var newArr=[];
            for( var i=0; i < arr.length; i++){
                if( indexOf(newArr,arr[i]) == -1){
                    newArr.push(arr[i])
                }
            }
            return newArr
        }


        function trim( str ){
            if( support.trim ){
                return str.trim();
            }
            return str.replace( /^\s+|\s+$/g,'')
        }

        var select= function (selector, results) {
            results = results || [];
            if( support.qsa ){
                push.apply( results,document.querySelectorAll(selector))
                return unique(results )
            }

            return select2(selector, results);
        }

        //先储存push方法 避免频繁的原型搜索和创建数组
        var push=[].push;

        //处理push的兼容问题
        try {
            push.apply([], document.getElementsByTagName('*'));
        }
        //}else{
            catch(e) {
            push = {
                apply:function ( a,b ){
                    for(var i = 0;i < b.length;i++){
                        a[a.length++] = b[i];
                    }
                    //return a;
                    return a.length;
                }
            }
        }


        //根据浏览器的能力 处理兼容性问题
        //支持就用 不支持自己实现
        //if( support.getElementsByClassName){
        //    return getElementByClassName;
        //}  (这什么都不是 要自己实现一个方法)

        function byClassName(className,node){
            if( node == document && support.getElementsByClassName ||
                node.nodeType == 1 && support.getElementsByClassName2 ){
                return node.getElementsByClassName
            } else{
                //自己实现
                var list = node.getElementsByTagName('*'),
                    i,
                    arr = [],
                    tempClassName;
                for (  i=0; i < list.length; i++){
                    tempClassName = list[i].getAttribute( className );
                    if( !tempClassName ) continue;
                    if( indexOf( tempClassName.split(''),className) != -1 ){
                        arr.push(arr[i]);
                    }
                }

                return arr;
            }
        }

        //四种基本的选择器
        function t( tagName,results ){
            results = results || [];
            push.apply(results,document.getElementsByTagName( tagName ));
            return results;
        };
        function c( className,results ){
            results = results || [];
            push.apply(results,byClassName( className ));
            return results;
        };
        function id( idName,results){
            results = results || [];
            var dom =document.getElementById( idName );
            if( dom ){
                push.apply( results, [ dom ]);
            }
            return results;
        }

        function select2( selector,results ){
            //将字符串 用splice转化成数组遍历 去除两端的空格
            results = results || [];
            var list = selector.split(',');
            for ( var i=0; i < list.length;i++ ){
                select3( trim(list[i]),results)
            }
            return unique(results)
        }

        function select3( selector,results ){
            //var first = selector.charAt(0);
            var first = selector.charAt( 0 );
            if ( selector.split( ' ' ).length === 1 ) {
                // 如果中间不含有空格, 那么就考虑基本选择器
                if ( selector === '*' ) {
                    return t( selector, results );
                } else if ( first === '#' ) {
                    return id( selector.slice( 1 ), results );

                } else if ( first === '.' ) {
                    return c( selector.slice( 1 ), results );

                } else {
                    return t( selector, results );
                }
            } else {
                // 处理其他的选择器
                throw new Error( '当前版本还不支持该选择器, 请联系 .....' );
            }
        }


        return select;

    })();

    poplar.select = select;

    //模块中的实例方法








    //DOM操作放在这
    poplar.praseHTML=(function (  ) {
        var node=document.createElement('div');
        function praseHTML( str ){
            node.innerHTML = str;
            var arr = [];
            arr.push.apply( arr, node.childNodes );
            return arr;
        }
        return praseHTML;
    })()
    //DOM实例方法
    poplar.extend({
        append: function ( parent,element ) {
            parent.appendChild( element );
        },
        prepend: function (parent, element) {
            parent.insertBefore( element,parent.fristChild)
        }
    })


    poplar.fn.extend( {

        appendTo: function ( selector ) {
            var iObj = this.constructor( selector),
                newObj = this.constructor(),
                tObj,
                arr = [];
            for ( var i =0; i < iObj.length; i++){
                for ( var j = 0; j < this.length; j++){
                    tObj = i = iObj.length - 1 === 0
                                                ?this[j]
                                                :this[j].cloneNode( true );
                    arr.push( tObj )
                    poplar.append(iObj[i],tObj)
                }
                push.apply(newObj,arr);
                newObj.prev = this;
                return newObj;
            }
        },

        append: function ( selector ) {
            this.constructor( selector ).appendTo( this );
            return this;
        },

        prependTo: function (selector) {
          var iObj = this.constructor(selector),
              tObj = {},
              newObj = this.constructor(),
              arr = [];
            for ( var i=0; i < iObj.length; i++){
                for ( var j = 0; j < this.length; j++ ){
                    tObj = i === iObj.length - 1
                                ? this[j]
                                :this[j].cloneNode( true );
                    arr.push(tObj);
                    poplar.prepend( iObj[i],tObj)

                }
            }
                [].push.apply(newObj,arr);
                newObj.prev = this;
                return newObj;
        },

        end: function () {
            return this.prev || this;
        },

        prepend: function ( selector ) {
            this.constructor( selector).prependTo(this);
            return this;
        }
    })
    // 事件处理
    Itcast.fn.extend({
        on: function ( type, callback ) {
            return this.each(function ( i, v ) {
                this.addEventListener( type, callback );
            });
        },
        off: function ( type, callback ) {
            return this.each(function () {
                this.removeEventListener( type, callback );
            });
        }
    });

    Itcast.each( ("onblur,onfocus,onclick,onmousedown,onmouseenter,onmouseleave,onmousemove,onmouseout," +
    "onmouseover,onmouseup,onmousewheel,onkeydown,onkeypress,onkeyup").split(','), function ( i, v ) {

        // 此时 v 是每一个 事件, 例如 'onclick', 去掉 on, slice( 2 )
        var event = v.slice( 2 );
        Itcast.fn[ event ] = function ( callback ) {
            return this.on( event, callback );
        };

    });


    Itcast.extend({
        getStyle: function ( dom, name ) {
            if ( dom.currentStyle ) {
                // IE 低版本
                return dom.currentStyle[ name ];
            } else {
                return window.getComputedStyle( dom )[ name ];
            }
        }

    });

    Itcast.fn.extend({

        css: function ( name, value ) {
            if ( typeof name === 'string' && typeof value === 'string' ) {
                // 带有两个参数
                // 遍历设置
                this.each(function () {
                    // this 就是 DOM 对象
                    this.style[ name ] = value;
                });

            } else if ( typeof name === 'string'  && value === undefined ) {
                // 获取样式值
                return Itcast.getStyle( this.get( 0 ), name );
            } else if ( typeof name === 'object' && value === undefined ) {
                // 遍历添加多个样式
                this.each(function () {
                    // this 就是 DOM 对象
                    for ( var k in name ) {
                        this.style[ k ] = name[ k ];
                    }

                    /*
                     var that = this;
                     I.each( name, function ( k, v ) {
                     that.style[ k ] = v;
                     });
                     */
                });
            }
            return this;
        },

        addClass: function ( name ) {

            // 遍历每一个 DOM 对象, 如果没有该类属性就加上
            this.each(function () {
                // this 是 DOM 对象
                var value = this.className; // undefiend, "   "
                // 'c1 c2 c3'
                if ( !value ) {  // 没有 类名属性
                    this.className = name;
                } else if ( value.split( ' ' ).indexOf( name ) == -1 ) {
                    this.className += ' ' + name;
                }
            });

            return this;
        },
        removeClass: function ( name ) {
            // 如果含有就移除, 如果没有就不管
            // 应该考虑循环移除
            // 就是如果用户添加了同名的类名, 应该全部移除
            // 循环移除
            this.each(function () {
                // this 就是 DOM 元素
                var value = this.className;
                // 需要移除的是 value 中的 name 值
                var arr = value.split( ' ' );
                var tmp;

                while ( ( tmp = arr.indexOf( name ) ) != -1 ) {
                    arr.splice( tmp, 1 );
                }

                // 赋值给 this.className
                this.className = arr.join( ' ' );
            });
            return this;
        },
        hasClass: function ( name ) {

            // 遍历凡是含有 的就是返回 true
            var res = this.map(function ( v, i ) {
                // v 就是 DOM 元素
                // 如果 v.className 中 含有 name 就返回一个 true
                // 为了可以减少更多的判断, 凡是看到 true 就 return
                var arr = v.className.split( ' ' );

                if ( arr.indexOf( name ) != -1 ) {
                    return true; // 如果不含有, 那么就不反回, 只有含有的时候才返回
                }
            });
            return res.length > 0;

            // ES5 中有 some
            // this 是伪数组
            /*
             return [].slice.call( this, 0 ).some(function ( v, i ) {
             return new RegExp( '\\b' + name + '\\b', 'g' ).test( v.className )
             });*/
        },

        toggleClass: function ( name ) {
            var that = this;
            this.each( function () {
                if ( that.constructor( this ).hasClass( name ) ) {
                    // 有
                    that.constructor( this ).removeClass( name );
                } else {
                    // 没有
                    that.constructor( this).addClass( name );
                }
            });
            return this;
        }

    });


// 属性操作
    Itcast.fn.extend({

        attr: function ( name, value ) {

            if ( typeof name === 'string' && typeof value === 'string' ) {
                this.each(function () {
                    // this DOM 对象
                    this.setAttribute( name, value );
                });
            } else if (typeof name === 'string' && value === undefined ) {
                return this[ 0 ].getAttribute( name );
            } else if ( typeof name === 'object' && value === undefined ) {
                this.each(function () {
                    for ( var k in name ) {
                        this.setAttribute( k, name[ k ] );
                    }
                });

            }
            return this;
        },

        removeAttr: function ( name ) {
            if ( typeof name === 'string' ) {
                this.each( function () {

                    // this 就是 DOM 对象
                    this.removeAttribute( name );
                });

            }
            return this;
        },


        prop: function ( name, value ) {

            if (typeof name === 'string' && typeof value === 'function') {
                this.each(function (v, i) {
                    // this DOM 对象
                    this[name] = value.call(this, this, i);
                });
            } else if (typeof name === 'string' && typeof value === 'boolean') {
                this.each(function () {
                    // this DOM 对象
                    this[name] = value;
                });
            } else if (typeof name === 'string' && value === undefined) {
                return this[0][name];
            } else if (typeof name === 'object' && value === undefined) {
                this.each(function () {
                    for (var k in name) {
                        this[k] = name[k];
                    }
                });

            }
            return this;
        }
        })


    //为了方便书写和避免重复
    window.poplar = window.Y = poplar;

})( window )
