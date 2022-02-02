import React, { Fragment, useEffect, useState } from 'react';

export default () => {
    const [newOwnerEmail, setNewOwnerEmail] = useState('');
    const [valid, setValid] = useState(null);
    const [status, setStatus] = useState('');
    const [Message, setMessage] = useState('');
    const [inputValue, setIputValue] = useState('');

    useEffect( () => {
        if( true === status ) {
            setIputValue( newOwnerEmail );
        } else {
            setIputValue( '' );
        }
    }, [status])

    const transferOwnership = async () => {
        let formData = new FormData();

        const params = new URLSearchParams(window.location.search)

        formData.append( 'action', 'ubc_h5p_ownership_transfer' );
        formData.append( 'nonce', ubc_h5p_ownership_transfer_admin.security_nonce );
        formData.append( 'email', newOwnerEmail );

        if( params.has('id') ) {
            formData.append( 'content_id', params.get('id') );
        }
        

        let response = await fetch(ajaxurl, {
            method: 'POST',
            body: formData
        })
        response = await response.json();
        console.log(response);
        setValid( response.valid );
        setStatus( response.status );
        setMessage( response.message ? response.message : '' );
    }

    const validateEmail = ( email ) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
    };

    return (
        <Fragment>
            <div role="button" className="h5p-toggle" tabIndex="0" aria-expanded="true" aria-label="Toggle panel"></div>
            <h2>Ownership Transfer</h2>
            <div className="h5p-panel">
            <input
                type="text"
                value={ newOwnerEmail }
                onChange={ e => {
                    setNewOwnerEmail( e.target.value );
                }}
            />
            <input
                name="h5p-content-new-author-email"
                hidden
                value={ inputValue }
            />
            <button
                onClick={ e => {
                    e.preventDefault();
                    if( ! validateEmail( newOwnerEmail ) ) {
                        alert( 'Email provided is not valid.' );
                        return;
                    }
                    transferOwnership();
                } }
                className="button"
            >
                Transfer
            </button>
            { null !== valid ? <p className='howto'>Status: <span className={`${ valid ? 'valid' : 'invalid' }`}>{ status  }</span></p> : null }
            { null !== valid && '' !== Message ? <p className='howto'>Message: <span className={`${ valid ? 'valid' : 'invalid' }`} dangerouslySetInnerHTML={{__html: Message}}></span></p> : null }
            <p className="howto">Enter the email address associated with a user on this platform. Pressing 'Transfer' will make that person the owner of this piece of H5P content.</p>
            </div>
        </Fragment>
    );
};