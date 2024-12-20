import '../css/PageControls.css';

function PageControls({ page, setPage, total, max }) {

    return (
        <div id='pageControls'>
            <span className='hoverable' onClick={() => { if (page > 1) { setPage(page - 1); } }}>{'<'}</span>
            <span className='hoverable'>{page}of {Math.floor(total / max) + 1}</span>
            <span className='hoverable' onClick={() => { if (page < Math.floor(total / max) + 1) { setPage(page + 1); } }}>{'>'}</span>
        </div>
    )
}

export default PageControls;