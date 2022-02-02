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

    const clearMessage = () => {
        setValid(null);
        setStatus('');
        setMessage('');
    }

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

        setValid( response.valid );
        setStatus( response.status );
        setMessage( response.message ? response.message : '' );
    }

    return (
        <Fragment>
            <div role="button" className="h5p-toggle" tabIndex="0" aria-expanded="true" aria-label="Toggle panel"></div>
            <h2>Ownership Transfer</h2>
            <div className="h5p-panel">
            <form
                onSubmit={ e => {
                    e.preventDefault();
                    transferOwnership();
                } }
                onvali
            >
            <input
                type="email"
                value={ newOwnerEmail }
                onChange={ e => {
                    setNewOwnerEmail( e.target.value );
                }}
                required
            />
            <input
                name="h5p-content-new-author-email"
                hidden
                value={ inputValue }
            />
            <button
                type="submit"
                className="button"
                onClick={(e) => {
                    clearMessage();
                }}
            >
                Transfer
            </button>
            </form>
            { null !== valid ? <p className='howto'>Status: <span className={`${ valid ? 'valid' : 'invalid' }`}>{ status  }</span></p> : null }
            { null !== valid && '' !== Message ? <p className='howto'>Message: <span className={`${ valid ? 'valid' : 'invalid' }`} dangerouslySetInnerHTML={{__html: Message}}></span></p> : null }
            <p className="howto">Enter the email address associated with a user on this platform. Pressing 'Transfer' will make that person the owner of this piece of H5P content.</p>
            </div>
        </Fragment>
    );
};