import React, { useState } from 'react';
import * as s from './index.css';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Button, Form, Input, message } from 'antd';
import { post, apiMap } from '@utils/api';
import { useHistory } from "react-router-dom";

const FormItem = Form.Item;

function Login() {
    const [secret, setSecret] = useState('');
    const history = useHistory();

    const info = async function(event: React.ChangeEvent<HTMLInputElement>) {
        setSecret(event.target.value);
    }

    async function enter() {
        const res = await post(apiMap.LOGIN, {
            password: secret
        });
        if (res.verifyResult) {
            localStorage.setItem('tk', res.accessToken);
            history.replace('/cloudDisk/disk.html');
            //  window.location.href='/cloudDisk/disk.html';
        } else {
            message.error('密码错误!');
        }
    }

    return (
        <div className={s.bg}>
            <div className={s.title}>欢迎进入DIY云盘</div>
            <div className={s.wrapper}>
                <Form >
                    <FormItem className={s.input}>
                        <Input.Password onChange={info}/>
                    </FormItem>
                </Form>
                <Button className={s.button} onClick={enter} type='primary'>Submit</Button>
            </div>

        </div>
    )
}

export default withStyles(s)(Login);