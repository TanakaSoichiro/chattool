'use strict';

    // 読み込み直後に動かすもの
    $(document).ready(function(){
        $('#edit').prop('disabled', true);
        $('#edit').css('opacity','0.2');
        $('#delete').prop('disabled', true);
        $('#delete').css('opacity','0.2');
        $(".my_speaks").removeAttr("id");
        $('.my_bubbles').removeAttr('id');
    });

    // アカウント処理
    var config = {
        apiKey: "AIzaSyDGXuhbwTiFT2tBVjcbdU0YRnJyTXJ4SRo",
        authDomain: "chattool-8cbea.firebaseapp.com",
        };
        firebase.initializeApp(config);
            
        // 新規登録
        function signUp() {
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function(result) {
                console.log(result);
                document.getElementById('log').innerText = '新規登録完了！ログインしました！';
            }).catch(function(error) {
                console.log('signup error')
                var errorCode = error.code;
                var errorMessage = error.message;
                document.getElementById('log').innerText = '新規登録に失敗しました。: ' + errorCode + ', ' + errorMessage;
            });
        };
            
        // ログイン
        function signIn() {
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function(result) {
                document.getElementById('log').innerText = 'ログインしました！';
            }).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                document.getElementById('log').innerText = 'ログインに失敗しました。: ' + errorCode + ', ' + errorMessage;
            });
        };
            
        // ログアウト
        function signOut() {
            firebase.auth().signOut().then(function() {
                $('#push_login').append('<div id="loginwindow"><div>');
                $('#loginwindow').append('<p id="log"></p>');
                document.getElementById('log').innerText = 'ログアウトしました。';
                $('#loginwindow').delay(5000).queue(function(){
                    $('#loginwindow').remove();
                });
            }).catch(function(error) {
                console.log(error);
                $('#push_login').append('<div id="loginwindow"><div>');
                $('#loginwindow').append('<p id="log"></p>');
                document.getElementById('log').innerText = 'ログアウトに失敗しました。';
                $('#loginwindow').delay(5000).queue(function(){
                    $('#loginwindow').remove();
                });
            });
        };
            
        // ログイン確認
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
            // ログイン認証済
                console.log('auth user', user);
                $('#login').prop('disabled', true);
                $('#login').css('opacity','0.2');
                $('#send').prop('disabled', false);
                $('#send').css('opacity','1.0');
                $('#logout').prop('disabled', false);
                $('#logout').css('opacity','1.0');
                $('#loginwindow').delay(5000).queue(function(){
                    $('#loginwindow').remove();
                });
            } else {
            // 未ログイン
                $('#login').prop('disabled', false);
                $('#login').css('opacity','1.0');
                $('#send').prop('disabled', true);
                $('#send').css('opacity','0.2');
                $('#logout').prop('disabled', true);
                $('#logout').css('opacity','0.2');
            }
        });
        // テーブルの取得、履歴の表示(SQL)

// 実装の必要がある動作
// 書いたメッセージを板に張り付ける動作
    $(document).on('click','#send' ,function() {
        firebase.auth().onAuthStateChanged(function(user) {
            $(".gustname").removeAttr("id");
            $(".my_speaks").removeAttr("id");
            $('.my_bubbles').removeAttr('id');
            $('#history').append('<div class="my_bubbles" id="my_bubble"></div>');
            $('#my_bubble').append('<div class="my_speaks" id="my_speak">表示中</div>');
            $('#my_bubble').append('<div class="gustname" id="gust">gustname</div>');
            var tx = document.getElementById("inputtext").value;
            document.getElementById("my_speak").innerText = tx;
            document.getElementById("gust").innerText = user.email;
            $("textarea").val("");
            $('#edit').prop('disabled', false);
            $('#edit').css('opacity','1.0');
            $('#delete').prop('disabled', false);
            $('#delete').css('opacity','1.0');
        });
    });

  // 各ボタンの動作

    // ログインボタン
    $(document).on('click','#login' ,function() {
        $('#push_login').append('<div id="loginwindow"><div>');
        $('#loginwindow').append('<p>メールアドレス</p>');
        $('#loginwindow').append('<input type="text" id="email" placeholder="xxx.xxx@gmail.com" />');
        $('#loginwindow').append('<p>パスワード</p>');
        $('#loginwindow').append('<input type="password" id="password" placeholder="xxxxxxxx" /><br/>');
        $('#loginwindow').append('<input type="button" class="btn" value="新規登録" onclick="signUp()" />');
        $('#loginwindow').append('<input type="button" class="btn" value="ログイン" onclick="signIn()" />');
        $('#loginwindow').append('<p id="log"></p>');
        $('#loginwindow').append('<p id="state"></p>');
    });
        

    // 編集ボタン
    $(document).on('click','#edit' ,function() {
        $('#s_e_toggle').empty();
        $('#s_e_toggle').append('<input type="button" class="left" id="complete" value="完了">');
        var copy = document.getElementById('my_speak').innerText;
        document.getElementById("inputtext").value = copy;
        $('#edit').prop('disabled', true);
        $('#edit').css('opacity','0.2');
        $('#delete').prop('disabled', true);
        $('#delete').css('opacity','0.2');
    });

    // 完了ボタン
    $(document).on('click','#complete' ,function() {
        $('#s_e_toggle').empty();
        $('#s_e_toggle').append('<input type="button" class="left" id="send" value="送信">');
        var tx = document.getElementById("inputtext").value;
        document.getElementById("my_speak").innerText = tx;
        $("textarea").val("");
        $('#edit').prop('disabled', false);
        $('#edit').css('opacity','1.0');
        $('#delete').prop('disabled', false);
        $('#delete').css('opacity','1.0');
    });

    // 削除ボタン
    $(document).on('click','#delete' ,function() {
        $('#delete_q').append('<div class="delete_yn"></div>');
        $('.delete_yn').append('<div id="inbox"></div>');
        $('#inbox').append('<p>直前のメッセージを削除しますか？</p>');
        $('#inbox').append('<div id="note">※削除後は元に戻せません。</div>');
        $('#inbox').append('<input type="button" id="y_btn" class="deletebtn" value="YES">');
        $('#inbox').append('<input type="button" id="n_btn" class="deletebtn" value="NO">');
    });
    // YESボタン
    $(document).on('click','#y_btn' ,function() {
        $(".delete_yn").remove();
        $("#my_bubble").remove();
        $('#edit').prop('disabled', true);
        $('#edit').css('opacity','0.2');
        $('#delete').prop('disabled', true);
        $('#delete').css('opacity','0.2');
    });
    // NOボタン
    $(document).on('click','#n_btn' ,function() {
        $(".delete_yn").remove();
    });

// 相手が書いた内容を画面左に表示する動作etc..(SQL)
    // chat画面を1秒ごとに更新する(ajax)
        // 更新毎にデータベースからメッセージがないか探す
            // あればmessageとnameを呼び出し、相手左側に表示させる。
            // 右側には表示させない。(右側の処理はjavascriptで実装)
            // 自分左側には載せない。(自分の名前で外せるかな？)

