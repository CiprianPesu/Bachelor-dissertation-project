import React from 'react';
import { useParams } from "react-router-dom";

import ViewNewsPage from './ViewNewsPage';

function GetViewNewsPage() {

    const { ViewNewsId } = useParams();
    console.log(ViewNewsId);

    return (
        <ViewNewsPage NewsID={ViewNewsId} />
    );
}

export default GetViewNewsPage;
