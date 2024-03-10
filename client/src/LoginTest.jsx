import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// 로그인 로그아웃 State 추가 예정
// ajax 통신 > 프로필기능 추가 예정 <팀원들과 같이!>

function LoginTest() {
    return(
        <div className="logintest">

           
            
            <Form className='LoginForm'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>아이디</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
                </Form.Group>
        
                <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>비밀번호</Form.Label>
                <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                </Form.Group>
                <Button variant="primary" type="submit">
                Submit
                </Button>
        </Form>

      </div>

        )
}

export default LoginTest;